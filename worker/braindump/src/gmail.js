// Gmail API client for the braindump Worker.
// Uses an offline refresh token (set as GMAIL_REFRESH_TOKEN secret) to mint
// access tokens on demand. Scope used: gmail.modify (read messages, modify labels).
//
// Required secrets:
//   GMAIL_CLIENT_ID
//   GMAIL_CLIENT_SECRET
//   GMAIL_REFRESH_TOKEN
// Required vars (or hard-coded fallback):
//   GMAIL_LABEL  (default: "brain-dump")
//   GMAIL_USER   (default: "me")

const TOKEN_URL  = 'https://oauth2.googleapis.com/token';
const API        = 'https://gmail.googleapis.com/gmail/v1/users/me';
const ACCESS_TTL = 50 * 60; // we'll cache access tokens in KV for ~50 min

export async function getAccessToken(env) {
  // Cache to avoid burning the refresh quota on every sync.
  if (env.BRAINDUMP_KV) {
    const cached = await env.BRAINDUMP_KV.get('gmail:access_token');
    if (cached) return cached;
  }
  const body = new URLSearchParams({
    client_id: env.GMAIL_CLIENT_ID,
    client_secret: env.GMAIL_CLIENT_SECRET,
    refresh_token: env.GMAIL_REFRESH_TOKEN,
    grant_type: 'refresh_token'
  });
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error('gmail_refresh_failed: ' + text.slice(0, 200));
  }
  const data = await r.json();
  if (!data.access_token) throw new Error('gmail_no_access_token');
  if (env.BRAINDUMP_KV) {
    await env.BRAINDUMP_KV.put('gmail:access_token', data.access_token, { expirationTtl: ACCESS_TTL });
  }
  return data.access_token;
}

async function gapi(env, path, opts) {
  const token = await getAccessToken(env);
  const r = await fetch(API + path, Object.assign({}, opts, {
    headers: Object.assign({ 'Authorization': 'Bearer ' + token }, (opts && opts.headers) || {})
  }));
  if (r.status === 401) {
    // Token went stale somehow — purge cache and retry once.
    if (env.BRAINDUMP_KV) await env.BRAINDUMP_KV.delete('gmail:access_token');
    const fresh = await getAccessToken(env);
    const r2 = await fetch(API + path, Object.assign({}, opts, {
      headers: Object.assign({ 'Authorization': 'Bearer ' + fresh }, (opts && opts.headers) || {})
    }));
    return r2;
  }
  return r;
}

export async function getLabelId(env, name) {
  const r = await gapi(env, '/labels');
  if (!r.ok) throw new Error('gmail_labels_failed_' + r.status);
  const data = await r.json();
  const match = (data.labels || []).find(l => l.name === name);
  return match ? match.id : null;
}

export async function listMessagesByLabel(env, labelId, max) {
  const params = new URLSearchParams({ labelIds: labelId, maxResults: String(max || 25) });
  const r = await gapi(env, '/messages?' + params.toString());
  if (!r.ok) throw new Error('gmail_list_failed_' + r.status);
  const data = await r.json();
  return data.messages || [];
}

export async function getMessage(env, id) {
  const r = await gapi(env, '/messages/' + id + '?format=full');
  if (!r.ok) throw new Error('gmail_get_failed_' + r.status);
  return r.json();
}

export async function getThread(env, id) {
  const r = await gapi(env, '/threads/' + id + '?format=metadata&metadataHeaders=From&metadataHeaders=Date');
  if (!r.ok) throw new Error('gmail_thread_failed_' + r.status);
  return r.json();
}

export async function removeLabel(env, msgId, labelId) {
  const r = await gapi(env, '/messages/' + msgId + '/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ removeLabelIds: [labelId] })
  });
  if (!r.ok) throw new Error('gmail_modify_failed_' + r.status);
  return r.json();
}

/* ---------- parsing helpers ---------- */

export function header(msg, name) {
  const h = ((msg.payload || {}).headers || []).find(x => x.name.toLowerCase() === name.toLowerCase());
  return h ? h.value : '';
}

export function extractPlainBody(msg) {
  // Prefer text/plain, fall back to text/html stripped, then snippet.
  const text = findPart(msg.payload, 'text/plain');
  if (text) return decodeB64Url(text).trim();
  const html = findPart(msg.payload, 'text/html');
  if (html) return stripHtml(decodeB64Url(html)).trim();
  return (msg.snippet || '').trim();
}

function findPart(part, mime) {
  if (!part) return null;
  if (part.mimeType === mime && part.body && part.body.data) return part.body.data;
  if (Array.isArray(part.parts)) {
    for (const p of part.parts) {
      const found = findPart(p, mime);
      if (found) return found;
    }
  }
  return null;
}

function decodeB64Url(s) {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(padded + '==='.slice((padded.length + 3) % 4));
  // bytes -> UTF-8 string
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function stripHtml(s) {
  return s
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
}

// Cheap "above the line" trimmer — drops quoted history + common signature markers.
// Good enough for triage; not a perfect mailbody parser.
export function topReply(body) {
  if (!body) return '';
  const cutMarkers = [
    /^On .+ wrote:$/m,
    /^-{2,} ?Original Message ?-{2,}$/m,
    /^From: .+$/m,
    /^Sent from my /m,
    /^--\s*$/m
  ];
  let cut = body.length;
  for (const re of cutMarkers) {
    const m = body.match(re);
    if (m && m.index < cut) cut = m.index;
  }
  return body.slice(0, cut).trim();
}

export function myAddressesFromProfile(env) {
  // GMAIL_USER var may list one or more comma-separated addresses (your aliases).
  // If unset, we'll match on the "me" Gmail label flag from the thread (handled separately).
  return (env.GMAIL_USER || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
}

// Tiny wrapper around GitHub's Contents API, proxied through pb-braindump's
// /github/proxy endpoint. The PAT lives only on pb-braindump as
// GITHUB_PUBLISH_TOKEN, mirroring how blog-gen / playbook-generator / inbox
// already call GitHub. pb-cms authenticates to the proxy with BRAINDUMP_TOKEN.

function repoSlug(env) {
  return `${env.GITHUB_OWNER}/${env.GITHUB_REPO}`;
}

async function gh(env, method, endpoint, body) {
  const r = await fetch(env.PB_BRAINDUMP_URL + '/github/proxy', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.BRAINDUMP_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      repo: repoSlug(env),
      method,
      endpoint,
      ...(body !== undefined ? { body } : {}),
    }),
  });
  return r;
}

function contentsEndpoint(path, ref) {
  const p = encodeURI(path.replace(/^\/+/, ''));
  return ref ? `contents/${p}?ref=${encodeURIComponent(ref)}` : `contents/${p}`;
}

export async function ghGetFile(env, path) {
  const r = await gh(env, 'GET', contentsEndpoint(path, env.GITHUB_BRANCH));
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub GET ${path} -> ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return {
    sha: j.sha,
    contentBase64: j.content,
    contentText: j.encoding === 'base64' ? b64decode(j.content) : j.content,
  };
}

export async function ghListDir(env, dir) {
  const r = await gh(env, 'GET', contentsEndpoint(dir, env.GITHUB_BRANCH));
  if (r.status === 404) return [];
  if (!r.ok) throw new Error(`GitHub LIST ${dir} -> ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return Array.isArray(j) ? j : [];
}

export async function ghPutFile(env, path, contentText, message, sha) {
  const body = {
    message,
    content: b64encode(contentText),
    branch: env.GITHUB_BRANCH,
    committer: { name: 'pb-cms', email: 'cms@plainblackcreative.com' },
  };
  if (sha) body.sha = sha;
  const r = await gh(env, 'PUT', contentsEndpoint(path), body);
  if (!r.ok) throw new Error(`GitHub PUT ${path} -> ${r.status}: ${await r.text()}`);
  return await r.json();
}

export async function ghPutBinary(env, path, bytesBase64, message, sha) {
  const body = {
    message,
    content: bytesBase64,
    branch: env.GITHUB_BRANCH,
    committer: { name: 'pb-cms', email: 'cms@plainblackcreative.com' },
  };
  if (sha) body.sha = sha;
  const r = await gh(env, 'PUT', contentsEndpoint(path), body);
  if (!r.ok) throw new Error(`GitHub PUT(binary) ${path} -> ${r.status}: ${await r.text()}`);
  return await r.json();
}

function b64encode(text) {
  // UTF-8 safe.
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64decode(b64) {
  const bin = atob(b64.replace(/\s+/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

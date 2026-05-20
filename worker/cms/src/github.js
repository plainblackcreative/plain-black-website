// Tiny wrapper around GitHub's Contents API. Each write becomes one commit
// on `main`. Cloudflare Pages picks the push up and redeploys automatically.

const API = 'https://api.github.com';

function headers(env) {
  return {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
    'User-Agent': 'pb-cms-worker',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function repoPath(env, path) {
  const p = path.replace(/^\/+/, '');
  return `${API}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${encodeURI(p)}`;
}

export async function ghGetFile(env, path) {
  const r = await fetch(`${repoPath(env, path)}?ref=${env.GITHUB_BRANCH}`, { headers: headers(env) });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub GET ${path} → ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return {
    sha: j.sha,
    contentBase64: j.content,
    contentText: j.encoding === 'base64' ? b64decode(j.content) : j.content,
  };
}

export async function ghListDir(env, dir) {
  const r = await fetch(`${repoPath(env, dir)}?ref=${env.GITHUB_BRANCH}`, { headers: headers(env) });
  if (r.status === 404) return [];
  if (!r.ok) throw new Error(`GitHub LIST ${dir} → ${r.status}: ${await r.text()}`);
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
  const r = await fetch(repoPath(env, path), {
    method: 'PUT',
    headers: { ...headers(env), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`GitHub PUT ${path} → ${r.status}: ${await r.text()}`);
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
  const r = await fetch(repoPath(env, path), {
    method: 'PUT',
    headers: { ...headers(env), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`GitHub PUT(binary) ${path} → ${r.status}: ${await r.text()}`);
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

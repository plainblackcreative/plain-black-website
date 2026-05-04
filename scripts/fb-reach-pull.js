#!/usr/bin/env node
/**
 * Pull Facebook unique reach for each shipped challenge day and write it
 * back into docs/challenge-data.json. Refreshes top-level stats afterwards.
 *
 * Strategy: list the PB Creative page's recent posts via Graph API, build
 * a "pfbid -> {page_id}_{post_id}" map, then look up each day's
 * facebook_url against that map and call /{post_id}/insights/post_impressions_unique.
 *
 * Env required:
 *   FB_PAGE_ID
 *   FB_PAGE_ACCESS_TOKEN  (never-expiring page access token)
 *
 * Designed to be safe to re-run: idempotent writes, no destructive moves.
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'docs', 'challenge-data.json');
const GRAPH = 'https://graph.facebook.com/v25.0';
const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN   = process.env.FB_PAGE_ACCESS_TOKEN;

if (!PAGE_ID || !TOKEN) {
  console.error('Missing FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN env var.');
  process.exit(1);
}

// pfbid slug or numeric ID after "/posts/". Used as a fast-path key when
// Facebook hasn't regenerated the slug between save and lookup. Pfbid
// slugs are not stable, so date-based matching is the reliable fallback.
function postKey(url) {
  if (!url) return null;
  const m = String(url).match(/\/posts\/(pfbid[A-Za-z0-9]+|\d+)/);
  return m ? m[1] : null;
}

// All YYYY-MM-DD strings within ±1 day of the given date string. Wider
// than strict equality so a day's challenge post counts even when the
// publish time crosses midnight UTC (NZ is +12/+13 vs. UTC).
function adjacentDates(dateStr) {
  if (!dateStr) return new Set();
  const center = new Date(dateStr + 'T12:00:00Z').getTime();
  const out = new Set();
  for (const offset of [-86400000, 0, 86400000]) {
    out.add(new Date(center + offset).toISOString().slice(0, 10));
  }
  return out;
}

// Score a candidate post against a challenge day. Higher is better.
// Vanity handle ('plainblackcreative') and the page id in the permalink
// are strong "this is a PB Creative original" signals; both rule out
// cross-page shares that show up in /published_posts. Distance from
// day.date midday is the tiebreaker among same-signal candidates.
function scoreCandidate(post, day) {
  let score = 0;
  const url = String(post.permalink_url || '');
  if (/\/plainblackcreative\//i.test(url)) score += 100;
  if (url.includes('/' + PAGE_ID + '/')) score += 50;
  if (post.created_time && day.date) {
    const target = new Date(day.date + 'T12:00:00Z').getTime();
    const dist = Math.abs(new Date(post.created_time).getTime() - target);
    score -= dist / (60 * 60 * 1000); // hours from target
  }
  return score;
}

// Find the page post that corresponds to a given challenge day.
// 1) try pfbid/numeric key match against permalink_url (fast path)
// 2) fall back to created_time within ±1 day of day.date, scored to
//    prefer PB Creative originals over same-day cross-page shares
function findPostForDay(day, pagePosts, keyToId) {
  const k = postKey(day.facebook_url);
  if (k && keyToId.has(k)) {
    const id = keyToId.get(k);
    return pagePosts.find(p => p.id === id) || { id };
  }
  if (!day.date) return null;
  const valid = adjacentDates(day.date);
  const matches = pagePosts.filter(p =>
    p.created_time && valid.has(p.created_time.slice(0, 10))
  );
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];
  return matches
    .slice()
    .sort((a, b) => scoreCandidate(b, day) - scoreCandidate(a, day))[0];
}

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); }
  catch (_) { throw new Error('Non-JSON response: ' + text.slice(0, 200)); }
  if (!res.ok || body.error) {
    const msg = body.error ? body.error.message : ('HTTP ' + res.status);
    throw new Error(msg);
  }
  return body;
}

async function listPagePosts() {
  // limit=100 covers a 30-day daily-post cadence with margin. The feed
  // mixes /posts/ entries with /reel/ and /videos/. We only filter out
  // non-/posts/ URLs (reels, videos) here. Authorship is already scoped
  // by the /{PAGE_ID}/published_posts endpoint, so URL-based author
  // filtering would just create false negatives on cross-page shares.
  const url = GRAPH + '/' + PAGE_ID + '/published_posts'
    + '?fields=id,permalink_url,created_time'
    + '&limit=100'
    + '&access_token=' + encodeURIComponent(TOKEN);
  const body = await fetchJson(url);
  const all = body.data || [];
  return all.filter(p => p.permalink_url && /\/posts\//.test(p.permalink_url));
}

// post_impressions_unique = unique reach (distinct people who saw the
// post). FB API v25.0 deprecated post_impressions and post_impressions_organic
// at the post level, so unique-reach is the only insights metric we
// have access to right now. The public label says "Reach" to match.
async function postViews(postId) {
  const url = GRAPH + '/' + postId + '/insights/post_impressions_unique'
    + '?access_token=' + encodeURIComponent(TOKEN);
  const body = await fetchJson(url);
  const v = body.data && body.data[0] && body.data[0].values && body.data[0].values[0];
  return v && typeof v.value === 'number' ? v.value : null;
}

// Note: the Graph API URL-resolution endpoint (?id=<url>) returns the
// URL itself as `id`, not a numeric post ID, so it can't be used to map
// our saved facebook_url to an insights-callable ID. We rely on
// findPostForDay (pfbid + date + origin scoring) to pick the post.

function recomputeStats(data) {
  const days = data.days || [];
  const stats = data.stats = data.stats || {};
  let days_complete = 0, built = 0, posts = 0, published = 0, reach = 0;
  for (const d of days) {
    if (d.is_weekly_report) continue;
    if (d.status === 'done') { days_complete++; built++; }
    if (d.facebook_url && String(d.facebook_url).trim()) posts++;
    // Published = a shipped day with a real URL. Days that have
    // placeholder slug text in published_url but aren't done don't
    // count.
    if (d.status === 'done' && d.published_url && /^https?:\/\//i.test(String(d.published_url).trim())) published++;
    reach += parseInt(d.reach) || 0;
  }
  stats.days_complete = days_complete;
  stats.built = built;
  stats.posts = posts;
  stats.published = published;
  stats.reach = reach;
  // Leave stats.enquiries and stats.conversations alone, those are manual.
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  console.log('Fetching page posts feed...');
  const pagePosts = await listPagePosts();
  console.log('  got', pagePosts.length, 'recent posts');

  const keyToId = new Map();
  for (const p of pagePosts) {
    const key = postKey(p.permalink_url);
    if (key) keyToId.set(key, p.id);
  }

  // Sample log to confirm the URL shape the API actually returns. Pfbid
  // slugs in permalink_url are not always stable across requests, which
  // is why findPostForDay falls back to created_time matching.
  if (pagePosts.length > 0) {
    console.log('  sample permalink_url:', pagePosts[0].permalink_url);
    console.log('  sample created_time: ', pagePosts[0].created_time);
  }

  let updated = 0, skipped = 0, failed = 0;
  for (const day of data.days) {
    if (day.is_weekly_report) continue;
    if (!day.facebook_url || !String(day.facebook_url).trim()) continue;

    // Resolve the post: use stored fb_post_id (manual override or prior
    // pin) if present, otherwise score-match against the page-posts feed.
    // The matched permalink_url is logged so the operator can verify
    // which post each day is locked to.
    let postId = day.fb_post_id || null;
    if (!postId) {
      const post = findPostForDay(day, pagePosts, keyToId);
      if (!post) {
        console.warn('Day', day.day, '(' + day.date + '): no matching FB post found');
        skipped++; continue;
      }
      postId = post.id;
      day.fb_post_id = postId;
      console.log('Day', day.day, '(' + day.date + '): pinned ->', postId,
        post.permalink_url ? '\n    ' + post.permalink_url : '');
    }

    try {
      const views = await postViews(postId);
      if (views == null) {
        console.warn('Day', day.day, ': insights returned no value');
        skipped++; continue;
      }
      const before = parseInt(day.reach) || 0;
      day.reach = views;
      if (before !== views) {
        console.log('Day', day.day, '(' + day.date + '):', before, '->', views, 'reach');
        updated++;
      }
    } catch (e) {
      console.error('Day', day.day, 'failed:', e.message);
      failed++;
    }
  }

  recomputeStats(data);
  data.challenge = data.challenge || {};
  data.challenge.last_updated = new Date().toISOString();

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log('Done. Updated:', updated, ', skipped:', skipped, ', failed:', failed);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });

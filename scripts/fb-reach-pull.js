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

// pfbid slug or numeric ID after "/posts/". Same shape on both ends so the
// map lookup matches what we extract from the saved facebook_url.
function postKey(url) {
  if (!url) return null;
  const m = String(url).match(/\/posts\/(pfbid[A-Za-z0-9]+|\d+)/);
  return m ? m[1] : null;
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
  // limit=100 covers a 30-day daily-post cadence with margin.
  const url = GRAPH + '/' + PAGE_ID + '/published_posts'
    + '?fields=id,permalink_url,created_time'
    + '&limit=100'
    + '&access_token=' + encodeURIComponent(TOKEN);
  const body = await fetchJson(url);
  return body.data || [];
}

async function postImpressionsUnique(postId) {
  const url = GRAPH + '/' + postId + '/insights/post_impressions_unique'
    + '?access_token=' + encodeURIComponent(TOKEN);
  const body = await fetchJson(url);
  const v = body.data && body.data[0] && body.data[0].values && body.data[0].values[0];
  return v && typeof v.value === 'number' ? v.value : null;
}

function recomputeStats(data) {
  const days = data.days || [];
  const stats = data.stats = data.stats || {};
  let days_complete = 0, built = 0, posts = 0, published = 0, reach = 0;
  for (const d of days) {
    if (d.is_weekly_report) continue;
    if (d.status === 'done') { days_complete++; built++; }
    if (d.facebook_url && String(d.facebook_url).trim()) posts++;
    if (d.published_url && String(d.published_url).trim()) published++;
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

  let updated = 0, skipped = 0, failed = 0;
  for (const day of data.days) {
    if (day.is_weekly_report) continue;
    if (!day.facebook_url || !String(day.facebook_url).trim()) continue;

    const key = postKey(day.facebook_url);
    if (!key) {
      console.warn('Day', day.day, ': unrecognized URL shape, skipping');
      skipped++; continue;
    }
    const postId = keyToId.get(key);
    if (!postId) {
      console.warn('Day', day.day, ': post not found in page feed (older than 100 posts back?)');
      skipped++; continue;
    }

    try {
      const reach = await postImpressionsUnique(postId);
      if (reach == null) {
        console.warn('Day', day.day, ': insights returned no value');
        skipped++; continue;
      }
      const before = parseInt(day.reach) || 0;
      day.reach = reach;
      if (before !== reach) {
        console.log('Day', day.day, ':', before, '->', reach);
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

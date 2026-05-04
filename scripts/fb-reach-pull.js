#!/usr/bin/env node
/**
 * Pull May Page-level Insights for the PB Creative Facebook page and
 * write the totals into docs/challenge-data.json under `month_stats`.
 * The public /challenge page reads `month_stats` for its hero numbers.
 *
 * Replaces the previous per-post matcher (pfbid drift + cross-page
 * shares + same-day-tiebreaking made it brittle). Page Insights are
 * stable, deterministic, and capture every piece of PB Creative
 * content during the challenge window — Ian's videos, the daily
 * builds, ad-hoc posts, replies — not just blog-attributed posts.
 *
 * Env required:
 *   FB_PAGE_ID
 *   FB_PAGE_ACCESS_TOKEN  (never-expiring page access token)
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'docs', 'challenge-data.json');
const GRAPH = 'https://graph.facebook.com/v25.0';
const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN   = process.env.FB_PAGE_ACCESS_TOKEN;

// May 2026 in NZ time, expressed in UTC. NZST is UTC+12.
//   May  1 00:00 NZ  =  Apr 30 12:00 UTC
//   Jun  1 00:00 NZ  =  May 31 12:00 UTC
const MAY_START_UTC = '2026-04-30T12:00:00+0000';
const MAY_END_UTC   = '2026-05-31T12:00:00+0000';

if (!PAGE_ID || !TOKEN) {
  console.error('Missing FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN env var.');
  process.exit(1);
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

// Fetch a single Page Insights metric across the May NZ window and
// return the summed daily values. For total counts (impressions,
// fan_adds, post_engagements) summing days gives the true monthly
// total. For unique counts (impressions_unique) summing days
// double-counts users who returned on later days; the result reads
// as "May reach (sum of daily uniques)" which is bounded above by
// true monthly unique reach but is what most month rollups show.
async function fetchMetricSum(metric) {
  // Cap `until` at "now" so we don't query a future window before
  // FB has data for it. After May 31 NZ, this naturally caps at the
  // full window.
  const nowIso = new Date().toISOString();
  const until = nowIso < MAY_END_UTC ? nowIso : MAY_END_UTC;
  const url = GRAPH + '/' + PAGE_ID + '/insights/' + metric
    + '?since=' + encodeURIComponent(MAY_START_UTC)
    + '&until=' + encodeURIComponent(until)
    + '&period=day'
    + '&access_token=' + encodeURIComponent(TOKEN);
  const body = await fetchJson(url);
  const series = body.data && body.data[0] && body.data[0].values;
  if (!series) return 0;
  let total = 0;
  for (const v of series) {
    if (typeof v.value === 'number') total += v.value;
  }
  return total;
}

// Recompute the per-day-derived stats (built, published, posts) from
// whatever the operator's tracker has put into the days array. The
// monthly bot-managed stats are kept in `month_stats` and not touched
// here. Leaves stats.enquiries and stats.conversations alone — the
// operator owns those (Leads pill in tracker writes conversations).
function recomputeOperatorStats(data) {
  const days = data.days || [];
  const stats = data.stats = data.stats || {};
  let days_complete = 0, built = 0, posts = 0, published = 0;
  for (const d of days) {
    if (d.is_weekly_report) continue;
    if (d.status === 'done') { days_complete++; built++; }
    if (d.facebook_url && String(d.facebook_url).trim()) posts++;
    if (d.status === 'done' && d.published_url
        && /^https?:\/\//i.test(String(d.published_url).trim())) published++;
  }
  stats.days_complete = days_complete;
  stats.built = built;
  stats.posts = posts;
  stats.published = published;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  console.log('Fetching May Page Insights (NZ window)...');
  const [reach, views, new_fans, engagements] = await Promise.all([
    fetchMetricSum('page_impressions_unique'),
    fetchMetricSum('page_impressions'),
    fetchMetricSum('page_fan_adds'),
    fetchMetricSum('page_post_engagements')
  ]);

  console.log('  May reach        :', reach);
  console.log('  May views        :', views);
  console.log('  May new followers:', new_fans);
  console.log('  May engagements  :', engagements);

  const before = data.month_stats || {};
  data.month_stats = {
    reach: reach,
    views: views,
    new_fans: new_fans,
    engagements: engagements,
    last_updated: new Date().toISOString()
  };

  recomputeOperatorStats(data);
  data.challenge = data.challenge || {};
  data.challenge.last_updated = new Date().toISOString();

  // Tidy: drop the per-day reach/fb_post_id from the legacy schema if
  // present, since they're no longer how the public stats are computed.
  for (const d of data.days || []) {
    if ('fb_post_id' in d) delete d.fb_post_id;
    if ('reach' in d) delete d.reach;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n');

  const changed = ['reach','views','new_fans','engagements']
    .some(k => before[k] !== data.month_stats[k]);
  console.log('Done.', changed ? 'month_stats changed.' : 'No change in month_stats.');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });

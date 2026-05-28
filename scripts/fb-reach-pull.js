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
// Returns the summed daily values for `metric` across the May NZ
// window, or null if FB rejects the metric name (deprecated etc).
// 0 vs null is the rejection signal used by tryMetrics() below.
async function fetchMetricSum(metric) {
  const nowIso = new Date().toISOString();
  const until = nowIso < MAY_END_UTC ? nowIso : MAY_END_UTC;
  const url = GRAPH + '/' + PAGE_ID + '/insights/' + metric
    + '?since=' + encodeURIComponent(MAY_START_UTC)
    + '&until=' + encodeURIComponent(until)
    + '&period=day'
    + '&access_token=' + encodeURIComponent(TOKEN);
  try {
    const body = await fetchJson(url);
    const series = body.data && body.data[0] && body.data[0].values;
    if (!series) return 0;
    let total = 0;
    for (const v of series) {
      if (typeof v.value === 'number') total += v.value;
    }
    return total;
  } catch (e) {
    return null;
  }
}

// Try a list of candidate metric names in order; returns the first
// one that FB accepts (even if the value is 0, that's a legit zero).
// Logs every rejection so it's clear what's still landing on the API.
async function tryMetrics(label, metrics) {
  for (const m of metrics) {
    const v = await fetchMetricSum(m);
    if (v !== null) {
      console.log('  ' + label + ': ' + v + ' (via ' + m + ')');
      return v;
    }
    console.warn('  ' + label + ': metric ' + m + ' rejected');
  }
  console.warn('  ' + label + ': all candidates rejected, defaulting to 0');
  return 0;
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
    // days_complete counts ALL done days (build days + weekly reports).
    // 'built' stays non-report only — a weekly-report day produces a
    // report, not a build. Mirrors computePublicStats in the admin tracker.
    if (d.status === 'done') days_complete++;
    if (d.is_weekly_report) continue;
    if (d.status === 'done') built++;
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
  // Each metric is a candidate chain — try the modern name first, fall
  // back to legacy. Some metric names that worked in v18 were retired
  // in v22+, so the chain protects us from quiet zero-fills.
  //
  // Meta's Business Suite UI labels in 2025+: Views, Viewers, Content
  // interactions, Link clicks, Visits, Follows. The public /challenge
  // dashboard renders Views (= total content views) and Interactions
  // (= content_interactions + link_clicks + visits).
  const views = await tryMetrics('May views         ', [
    'page_views_total',
    'page_post_impressions',
    'page_impressions_organic',
    'page_impressions'
  ]);
  // Meta UI tile is "Net follows" = adds - unfollows. The chain below
  // returns gross adds (e.g. page_daily_follows_unique gave 4 for the
  // window where the UI showed 2). When re-enabling the cron, replace
  // this with adds - removes via page_fan_adds + page_fan_removes.
  const net_follows = await tryMetrics('May net follows   ', [
    'page_daily_follows_unique',
    'page_daily_follows',
    'page_fan_adds_unique',
    'page_fan_adds'
  ]);
  // Interactions = content interactions + link clicks + visits, summed
  // from three separate Page Insights calls so a single broken metric
  // doesn't zero the whole number. Each component logs independently so
  // it's obvious which v25 metric names land.
  const content_interactions = await tryMetrics('  content_interactions', [
    'page_content_interactions',
    'page_post_engagements'
  ]);
  const link_clicks = await tryMetrics('  link_clicks         ', [
    'page_consumptions_unique',
    'page_consumptions',
    'page_post_engagements_link_clicks'
  ]);
  const visits = await tryMetrics('  visits              ', [
    'page_visit_post_impressions',
    'page_views_external_referrals'
  ]);
  const interactions = content_interactions + link_clicks + visits;
  console.log('May interactions  : ' + interactions
    + ' (= ' + content_interactions + ' content + '
    + link_clicks + ' clicks + ' + visits + ' visits)');

  const before = data.month_stats || {};
  const next = {
    views: views,
    interactions: interactions,
    net_follows: net_follows,
    last_updated: new Date().toISOString()
  };
  // Don't regress on empty: if a metric came back 0 but was previously
  // non-zero, keep the prior value. Protects against FB silently
  // zero-filling deprecated metrics mid-month. The tryMetrics chain
  // already logs which name was accepted, so a real drop to zero would
  // need a separate manual reset.
  for (const k of ['views', 'interactions', 'net_follows']) {
    if (next[k] === 0 && Number(before[k]) > 0) {
      console.warn('  ' + k + ': API returned 0, keeping prior value ' + before[k]);
      next[k] = before[k];
    }
  }
  data.month_stats = next;

  recomputeOperatorStats(data);
  data.challenge = data.challenge || {};
  data.challenge.last_updated = new Date().toISOString();

  // Tidy: drop the legacy per-day fb_post_id field if present.
  // The per-day reach -> views rename is handled by the migration; the
  // FB cron no longer writes anything per-day (operator-tracked now).
  for (const d of data.days || []) {
    if ('fb_post_id' in d) delete d.fb_post_id;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n');

  const changed = ['views','interactions','net_follows']
    .some(k => before[k] !== data.month_stats[k]);
  console.log('Done.', changed ? 'month_stats changed.' : 'No change in month_stats.');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });

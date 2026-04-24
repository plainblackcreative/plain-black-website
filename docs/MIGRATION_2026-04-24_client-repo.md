# Client Repo Migration, 2026-04-24

## Summary

Client playbook delivery moved from the public site repo (`plainblackcreative/plain-black-website`) to a new private repo (`plainblackcreative/plainblack-client`). Files now serve at `client.plainblackcreative.com` via Cloudflare Pages instead of `plainblackcreative.com/playbooks/client-playbooks/` via GitHub Pages.

Executed end-to-end in Chat 6 with a live throwaway publish test. No customer files existed at time of migration.

## Why

- Public site repo should not host client data, even at unguessable slugs
- Dedicated private repo enables clean separation of marketing content (public) from delivered client work (private)
- Opens `/custom/` and `/archive/` folders in the private repo for bespoke client work alongside generator output
- Cloudflare Pages on the private repo gives the same fast deploys without the public-repo exposure

## What changed

### Code

`admin/generator.html` (commit `09446c4`):

- `REPO` constant now points to `plainblackcreative/plainblack-client` (the publish target)
- New `TEMPLATE_REPO` constant points to `plainblackcreative/plain-black-website` so templates continue to be read anonymously via raw.githubusercontent.com (templates are not sensitive and staying public avoids GitHub API rate-limit cost on every generation)
- `API_BASE` derived from `REPO` (authenticated writes)
- `TEMPLATE_BASE` derived from `TEMPLATE_REPO` (anonymous reads)
- Output path changed from `playbooks/client-playbooks/[slug].html` to `playbooks/[slug].html`
- `PLAYBOOK_URL_BASE` and Publish success UI updated to `client.plainblackcreative.com`
- Publish success message updated from "GitHub Pages rebuild" to "Cloudflare Pages rebuild"

### Infrastructure

- New private GitHub repo: `plainblackcreative/plainblack-client`
- New Cloudflare Pages project connected to the private repo, deploys from `main`
- New DNS record: CNAME `client` to `plainblack-client.pages.dev`, proxied
- New custom domain on Pages project: `client.plainblackcreative.com`

### Documentation

- `/robots.txt` (commit `b406c4d`): removed obsolete `Disallow: /playbooks/client-playbooks/` line
- `docs/PLAINBLACK_BUILD_SPEC.md` and `docs/PLAINBLACK_MASTER.md` (commit `f4f5a69`): URL references, repo structure diagrams, paywall architecture notes, robots.txt guidance, and deferred-features lists all updated for the new architecture
- `admin/README.md` (commit `688f3a9`): new "Where playbooks are published" section with PAT generation steps, updated troubleshooting notes, 1Password references removed

## What operators need to do

Each operator (Jayden, Ian) needs a fresh fine-grained PAT scoped to the private repo:

1. GitHub, Settings, Developer settings, Personal access tokens, Fine-grained tokens
2. Generate new token
3. Resource owner: `plainblackcreative`
4. Repository access: Only select repositories, pick `plainblack-client`
5. Repository permissions, Contents: Read and write
6. Expiry: 90 days
7. Paste at next admin login

Old PATs scoped to `plain-black-website` keep working for the blog generator and can be kept in place. If an operator also publishes blog posts, they hold two PATs and swap at admin login as needed.

## Things the migration plan got wrong (findings)

1. **Templates would have 404d.** The original plan missed that `TEMPLATE_BASE` was derived from `REPO`. When `REPO` moved to the private repo, template reads would have 404d against `raw.githubusercontent.com` (which requires auth for private repos, and the fetch was anonymous). Fix: split into two constants, `TEMPLATE_REPO` pointing at the public repo.

2. **Test mode blocks Publish.** The plan proposed generating a test customer with test mode on (prefixes slugs with `z-test-`) then cleaning up. In practice, test mode disables the Publish button entirely. The D4 test was run with test mode off, so the cleanup targeted exact filenames rather than a `z-test-*` glob.

3. **Each publish is two commits, not one.** The generator calls the GitHub API twice per publish (one PUT for the locked file, one for the unlocked), producing two sequential commits. The plan referenced a single commit per publish.

## Verification performed

- Private repo structure verified, readable
- Cloudflare Pages built and served the custom domain successfully
- Generator deploy verified byte-identical to local working copy
- End-to-end publish test: customer generated, 2 files committed to private repo, both URLs loaded correctly at `client.plainblackcreative.com`, Stripe CTA present, AI proxy calls working
- Test files removed, URLs verified 404
- All grep checks for stale `client-playbooks` references returned 0 hits across code, infra, and docs
- No em dashes introduced in any new text

## Rollback

Not recommended (reverses private-repo protection), but if needed:

1. In `admin/generator.html`, change `REPO` back to `plainblackcreative/plain-black-website` and `TEMPLATE_REPO` back to the same (or remove the split and re-derive `TEMPLATE_BASE` from `REPO`)
2. Change `PLAYBOOK_URL_BASE` back to `https://plainblackcreative.com/playbooks/client-playbooks/`
3. Change output paths back to `playbooks/client-playbooks/[slug].html`
4. Change publish success URL construction back to `https://plainblackcreative.com/`
5. Recreate `/playbooks/client-playbooks/` folder in the public repo
6. Commit and push admin repo changes
7. Delete Cloudflare Pages project `plainblack-client` and the `client` DNS record
8. Private repo can be left in place (no public footprint) or archived

Note: rolling back exposes client files publicly again. Prefer forward fixes.

## Related commits

- `09446c4` Generator: target private plainblack-client repo via client.plainblackcreative.com
- `b406c4d` robots.txt: remove obsolete Disallow for client-playbooks path
- `f4f5a69` Docs: update spec files for private-repo client delivery migration
- `688f3a9` admin/README: document new private-repo publish target and PAT scope

## Related commits in the private repo (`plainblackcreative/plainblack-client`)

- `a186ba8` Initial commit
- `f39edf8` Initial structure: playbooks/, custom/, archive/
- `f86219a` README: replace em dashes with colons (brand rule)
- `90d2f03`, `4fd5d59` Migration test customer files (sequential, reverted in `fc1dc85`)
- `fc1dc85` Remove D4 migration test files (post-verification)

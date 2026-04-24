# PlainBlack admin

Everything you need to run delivery, blog, and Hub is at one address now.

## Login

**URL:** https://admin.plainblackcreative.com/

First visit of the day, you'll see a login screen asking for two things:

- **Password:** `PlainBlack1!` (unchanged)
- **GitHub PAT:** fine-grained token scoped to the `plainblack-client` private repo (contents: read and write, 90-day expiry). Each operator generates their own. See the PAT setup note below.

Enter both, click Unlock. That's it for the session. You won't be asked again until you log out or clear your browser storage.

## Where playbooks are published

All generated playbooks go to the private GitHub repo `plainblackcreative/plainblack-client`, served at `https://client.plainblackcreative.com/playbooks/[slug].html`.

Your PAT must be scoped to `plainblack-client`, not the public website repo. If Publish returns a permission error, your token is probably scoped to the old repo.

To generate a new fine-grained PAT:

1. GitHub, Settings, Developer settings, Personal access tokens, Fine-grained tokens
2. Generate new token
3. Resource owner: `plainblackcreative`
4. Repository access: Only select repositories, pick `plainblack-client`
5. Repository permissions, Contents: Read and write
6. Expiry: 90 days
7. Generate, copy the token, paste at next admin login

If you also publish blog posts, you'll need a second PAT scoped to the public `plain-black-website` repo for the blog generator. The admin login only stores one PAT at a time, so swap as needed.

## What's on admin.plainblackcreative.com

| URL | Tool |
|---|---|
| `/` | Hub |
| `/generator` | Playbook Generator |
| `/blog-gen` | Blog Generator |

One login covers all three. Click between them freely, no re-prompting.

## Bookmarks

Ditch the old `plainblackcreative.github.io/...` URLs. Old bookmarks will either redirect or 404. Replace them with:

- Hub: https://admin.plainblackcreative.com/
- Generator: https://admin.plainblackcreative.com/generator
- Blog: https://admin.plainblackcreative.com/blog-gen

## What hasn't changed

The delivery flow itself. Pick template, fill customer data, Generate, Publish, send Email 1, customer pays, send Email 2. Exactly as before.

## If something breaks

**Login screen keeps reappearing.** PAT has probably expired (90-day rotation). Generate a new one per the steps in "Where playbooks are published" above, or flick me a message.

**Publish fails.** PAT issue in 99% of cases. Either expired, or scoped to the wrong repo. Client deliveries need a PAT scoped to `plainblack-client`. Regenerate per the steps in "Where playbooks are published" above.

**Template won't load in generator.** Rare. Templates are fetched from GitHub directly and the CDN caches for about 5 minutes after any template edit. Wait, retry.

**Anything else weird.** Message me.

## Logout

Top right of the Hub. Clears your session. Next visit, you'll need password + PAT again.

---

*Last updated April 2026 after F6 admin consolidation.*

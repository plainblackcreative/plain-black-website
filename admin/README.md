# PlainBlack admin

Everything you need to run delivery, blog, and Hub is at one address now.

## Login

**URL:** https://admin.plainblackcreative.com/

First visit of the day, you'll see a login screen asking for two things:

- **Password:** `PlainBlack1!` (unchanged)
- **GitHub PAT:** shared Publish token, see 1Password

Enter both, click Unlock. That's it for the session. You won't be asked again until you log out or clear your browser storage.

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

**Login screen keeps reappearing.** PAT has probably expired (90-day rotation). Grab the current one from 1Password or flick me a message.

**Publish fails.** Same as above, PAT issue in 99% of cases.

**Template won't load in generator.** Rare. Templates are fetched from GitHub directly and the CDN caches for about 5 minutes after any template edit. Wait, retry.

**Anything else weird.** Message me.

## Logout

Top right of the Hub. Clears your session. Next visit, you'll need password + PAT again.

---

*Last updated April 2026 after F6 admin consolidation.*

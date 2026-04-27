# Contributing

Short version: **don't push to `main` directly anymore**. Branch, push, PR, merge.

---

## The flow

```bash
# 1. Pull latest main
git checkout main
git pull

# 2. Branch off it
git checkout -b feat/your-thing-here    # or fix/, chore/, claude/, whatever

# 3. Work, commit
git add ...
git commit -m "your-thing: what you did and why"

# 4. Push the branch (NOT to main)
git push -u origin feat/your-thing-here

# 5. Open a PR on GitHub
#    https://github.com/plainblackcreative/plain-black-website/compare/main...feat/your-thing-here
#    Or use the link printed by `git push`.

# 6. Merge the PR (small change, no review needed → just hit Merge)
#    Cloudflare Pages auto-deploys from main.
```

That's it.

## Branch naming

- `feat/<thing>` — new feature, page, section
- `fix/<thing>` — bug fix
- `chore/<thing>` — dependency bump, doc tweak, repo housekeeping
- `claude/<id>` — when Claude Code is driving the change in a worktree
- `style/<thing>` — pure CSS / visual changes

Keep branches short-lived. Big themes get one branch each, not one branch for the whole quarter.

## Commit messages

Match the existing style:

```
<short scope>: <what you did and why>

<optional body explaining the change in more detail —
why this approach, what trade-offs, what to watch out for>

Co-Authored-By: ...
```

Examples we already have:

- `home: apply dark cinematic style across all sections`
- `bot: real Claude via pb-bot Cloudflare Worker (with KB fallback)`
- `perf: 91% smaller portfolio images via npm run optimize-images`

The first line goes in the PR title. The body goes in the PR description.

## Workers (the Cloudflare ones under `worker/*`)

Workers don't deploy through Pages. They deploy via `wrangler` from the repo. After your PR is merged to `main`:

```bash
cd worker/<worker-name>     # bot, scratchpad, leaderboard
npx wrangler deploy
```

Each worker dir has its own `README.md` with the full one-time setup (KV namespace, secrets) and ongoing deploy commands.

If you only changed HTML / CSS / front-end JS, no Worker deploy is needed — Pages picks it up automatically.

## What about hot fixes?

Branch protection in this repo is set up to allow repo admins to bypass the PR requirement in genuine emergencies (the site is down, someone leaked a key, etc.). Don't use that for normal work — it leaves no audit trail. Push a branch and merge it like everything else, even if the change is one line.

## What changed?

Up until 27 April 2026, every commit on this repo went straight to `main`. That made it fast but risky — no PR review, no list of "what's about to ship", no easy way to revert a bundle. Branch protection on `main` enforces the PR step now for normal work. Repo admins (Ian, Jay) can bypass when there's a real fire — but that should be the exception, not the routine.

---

## One-time setup: enable branch protection

If you're reading this and the rule isn't actually configured yet, here's how (5 min, GitHub UI only).

1. Go to **[Settings → Branches → Add classic branch protection rule](https://github.com/plainblackcreative/plain-black-website/settings/branches)**.
2. **Branch name pattern:** `main`
3. Tick:
   - ✅ **Require a pull request before merging**
     - Required approvals: **0** (we're a 2-person team; review-by-self is fine)
     - Other sub-options: leave default
   - ✅ **Require linear history** (optional but tidy — forces squash/rebase, no merge commits)
4. Leave UN-ticked:
   - ❌ Require status checks (none configured yet — leave the slot for later if we add CI)
   - ❌ Require conversation resolution (overkill for this team size)
   - ❌ Require signed commits
   - ❌ Require deployments to succeed
   - ❌ **Do not allow bypassing the above settings** — leave OFF so admins (you + Ian) can bypass for genuine emergencies
   - ❌ Allow force pushes
   - ❌ Allow deletions
5. Click **Create**.

After this:
- A `git push origin main` from any non-admin = rejected with a clear error.
- The same push from an admin (you, Ian) = goes through, but GitHub records who bypassed and when.
- The PR flow above is required for everyone in normal work.

If you ever want to undo it, same page → Edit rule → Delete.

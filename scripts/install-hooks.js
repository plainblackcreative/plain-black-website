#!/usr/bin/env node
// Installs git hooks into .git/hooks/. Idempotent.
//
// Run once after cloning:  npm run install-hooks
//
// The pre-push hook keeps the CF beacon and website-pages.json (at site root)
// in sync with the files on disk — so a new blog post can't ship to GitHub
// Pages without being tracked. The page manifest is also consumed
// cross-origin by the Website Overview tool on admin.plainblackcreative.com.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOOKS_DIR = path.join(ROOT, '.git', 'hooks');

const PRE_PUSH = `#!/usr/bin/env bash
# Auto-installed by scripts/install-hooks.js
# Auto-heals header + footer drift, syncs tracking artefacts, then lints
# chrome before each push. Any working-tree changes the hook produces must
# be committed by hand — the hook never pushes regenerated files for you.
set -e

cd "$(git rev-parse --show-toplevel)"

echo "→ pre-push: stamping canonical header + footer..."
npm run --silent repair:footer >/dev/null
npm run --silent repair:header >/dev/null

echo "→ pre-push: syncing CF beacon + page manifest..."
npm run --silent sync-tracking >/dev/null

# The '*.html' pathspec matches nested paths too (tools/, givesback/cases/,
# playbooks/**), so this single guard catches any file the repairs rewrote.
if ! git diff --quiet -- website-pages.json '*.html'; then
  echo ""
  echo "  ✗ Hook regenerated files. Commit them before pushing:"
  git diff --name-only | sed 's/^/      /'
  echo ""
  exit 1
fi

echo "  ✓ tracking in sync"

echo "→ pre-push: linting site chrome..."
if ! npm run --silent lint:chrome >/dev/null 2>&1; then
  echo ""
  echo "  ✗ Site chrome drift detected. Re-run for details:"
  echo "      npm run lint:chrome"
  echo "  Header / mobile-nav drift must be fixed by hand on top-level pages."
  echo ""
  exit 1
fi

echo "  ✓ chrome canonical"
`;

if (!fs.existsSync(HOOKS_DIR)) {
  console.error('No .git/hooks/ directory — is this a git repo?');
  process.exit(1);
}

const target = path.join(HOOKS_DIR, 'pre-push');
fs.writeFileSync(target, PRE_PUSH);
fs.chmodSync(target, 0o755);

console.log('✓ installed .git/hooks/pre-push');
console.log('');
console.log('On every git push, the hook will run `npm run repair:footer` +');
console.log('`npm run repair:header`, `npm run sync-tracking`, then');
console.log('`npm run lint:chrome` — and abort if any step regenerates files');
console.log('(commit them) or detects drift.');

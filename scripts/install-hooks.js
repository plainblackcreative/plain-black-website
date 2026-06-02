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
# Keeps tracking artefacts in sync and chrome non-drifted before each push.
set -e

cd "$(git rev-parse --show-toplevel)"

echo "→ pre-push: syncing CF beacon + page manifest..."
npm run --silent sync-tracking >/dev/null

if ! git diff --quiet -- website-pages.json '*.html' 'blog/*.html' 'playbooks/**/index.html' 'givesback/cases/*.html'; then
  echo ""
  echo "  ✗ Tracking artefacts changed. Commit the regenerated files before pushing:"
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
  echo "  Footer drift can be auto-healed with:"
  echo "      npm run repair:footer"
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
console.log('On every git push, the hook will run `npm run sync-tracking`,');
console.log('then `npm run lint:chrome`, and abort if either step has changes');
console.log('to commit or detects canonical-chrome drift.');

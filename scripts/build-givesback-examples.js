// Edit givesback-examples.json, then run this script to update both page views.
// Use --check to detect drift without writing files.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const examples = JSON.parse(fs.readFileSync(path.join(__dirname, 'givesback-examples.json'), 'utf8'));
const check = process.argv.includes('--check');
let drift = false;
for (const relative of ['givesback.html', ...examples.map(e => `givesback/cases/${e.slug}.html`)]) {
  const file = path.join(root, relative);
  const original = fs.readFileSync(file, 'utf8');
  let output = original;
  for (const example of examples) {
    if (relative !== 'givesback.html' && !relative.endsWith(`/${example.slug}.html`)) continue;
    for (const field of ['story', 'math']) {
      const start = `<!-- gb-example:${example.slug}:${field}:start -->`;
      const end = `<!-- gb-example:${example.slug}:${field}:end -->`;
      const a = output.indexOf(start), b = output.indexOf(end);
      if (a < 0 || b < a || output.indexOf(start, a + 1) !== -1) throw new Error(`Missing or duplicate markers: ${relative} ${field}`);
      output = output.slice(0, a + start.length) + '\n' + example[field] + '\n' + output.slice(b);
    }
  }
  if (output !== original) {
    drift = true;
    if (!check) fs.writeFileSync(file, output);
    console.log(`${check ? 'Out of sync' : 'Updated'}: ${relative}`);
  }
}
if (check && drift) process.exitCode = 1;
else console.log('GivesBack example views match the shared source.');

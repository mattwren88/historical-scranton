/* Regenerate pairs/*.html and the index ledger from data/pairs.js.
   Run after editing the manifest:  node tools/build.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readManifest } from './manifest.mjs';
import { pairPage, ledger } from './templates.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER_START = '<!-- ledger:start -->';
const LEDGER_END = '<!-- ledger:end -->';

const { pairs } = readManifest(ROOT);

for (const pair of pairs) {
  const out = path.join(ROOT, 'pairs', `${pair.slug}.html`);
  fs.writeFileSync(out, pairPage(pair));
}
console.log(`built ${pairs.length} pair pages`);

/* The index ledger is injected between markers so the rest of index.html
   stays hand-written. Task 6 adds the markers; until then, skip quietly. */
const indexPath = path.join(ROOT, 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
const start = index.indexOf(LEDGER_START);
const end = index.indexOf(LEDGER_END);
if (start >= 0 && end > start) {
  index = index.slice(0, start + LEDGER_START.length)
        + '\n' + ledger(pairs) + '\n    '
        + index.slice(end);
  fs.writeFileSync(indexPath, index);
  console.log('injected the index ledger');
} else {
  console.log('index.html has no ledger markers yet — skipping (expected until Task 6)');
}

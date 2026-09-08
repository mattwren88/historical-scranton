/* The test suite for a site with no test framework.
   Structural assertions only: does every declared thing exist, does every
   referenced thing resolve, is anything present that nothing references.
   Run: node tools/check.mjs      Exit 0 = pass, 1 = fail. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readManifest } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (msg) => failures.push(msg);
const rel = (p) => path.relative(ROOT, p);

const HALVES = ['then', 'now'];
const IMAGE_FILES = ['then.jpg', 'now.jpg', 'thumb-then.jpg', 'thumb-now.jpg'];

const manifest = readManifest(ROOT);
const pairs = manifest.pairs;
const slugs = pairs.map((p) => p.slug);

/* --- 1. every manifest entry has a page, every page has a manifest entry --- */
const pageFiles = fs.readdirSync(path.join(ROOT, 'pairs'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''));

for (const slug of slugs) {
  if (!pageFiles.includes(slug)) fail(`manifest lists "${slug}" but pairs/${slug}.html does not exist`);
}
for (const slug of pageFiles) {
  if (!slugs.includes(slug)) fail(`pairs/${slug}.html exists but "${slug}" is not in the manifest`);
}

/* --- 2. slugs are unique --- */
const seen = new Set();
for (const slug of slugs) {
  if (seen.has(slug)) fail(`duplicate slug in manifest: "${slug}"`);
  seen.add(slug);
}

/* --- 3. every pair has its four images --- */
for (const slug of slugs) {
  for (const name of IMAGE_FILES) {
    const p = path.join(ROOT, 'images', slug, name);
    if (!fs.existsSync(p)) fail(`missing image: ${rel(p)}`);
  }
}

/* --- 4. every src/href in every shipped HTML file resolves on disk --- */
const htmlFiles = [
  path.join(ROOT, 'index.html'),
  ...pageFiles.map((s) => path.join(ROOT, 'pairs', `${s}.html`)),
];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|data:|#)/.test(ref)) continue;
    const target = path.resolve(dir, ref.split('#')[0].split('?')[0]);
    if (!fs.existsSync(target)) fail(`${rel(file)} references missing file: ${ref}`);
  }
  /* srcset needs its own pass — comma-separated "url width" candidates */
  const sets = [...html.matchAll(/srcset="([^"]+)"/g)].map((m) => m[1]);
  for (const set of sets) {
    for (const candidate of set.split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (!url || /^(https?:|data:)/.test(url)) continue;
      const target = path.resolve(dir, url);
      if (!fs.existsSync(target)) fail(`${rel(file)} srcset references missing file: ${url}`);
    }
  }
}

/* --- 5. nothing under images/ is unreferenced --- */
const referenced = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const urls = [
    ...[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/srcset="([^"]+)"/g)]
      .flatMap((m) => m[1].split(',').map((c) => c.trim().split(/\s+/)[0])),
  ];
  for (const u of urls) {
    if (!u || /^(https?:|mailto:|data:|#)/.test(u)) continue;
    referenced.add(path.resolve(dir, u.split('#')[0].split('?')[0]));
  }
}
/* series.js builds thumbnail URLs at runtime, so they never appear in markup. */
for (const slug of slugs) {
  for (const half of HALVES) {
    referenced.add(path.join(ROOT, 'images', slug, `thumb-${half}.jpg`));
  }
}
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
for (const file of walk(path.join(ROOT, 'images'))) {
  if (path.basename(file).startsWith('.')) continue;
  if (!referenced.has(file)) fail(`orphan image, referenced by nothing: ${rel(file)}`);
}

/* --- 6. no dead CSS class selectors --- */
const css = fs.readFileSync(path.join(ROOT, 'assets', 'site.css'), 'utf8');
const consumers = [
  ...htmlFiles.map((f) => fs.readFileSync(f, 'utf8')),
  fs.readFileSync(path.join(ROOT, 'assets', 'series.js'), 'utf8'),
  fs.readFileSync(path.join(ROOT, 'assets', 'slider.js'), 'utf8'),
  fs.readFileSync(path.join(ROOT, 'tools', 'templates.mjs'), 'utf8').toString(),
].join('\n');
/* Classes applied only by script through a computed string, or that exist for
   a state the checker cannot see, are listed here with a reason. */
const CSS_ALLOWLIST = new Set([
  'pair--wide',    // toggled by slider.js
  'pair--transit', // toggled by slider.js
  'icon--gold',    // built by series.js icon(name, gold)
  'row__then',     // built by templates.mjs ledger() via the row__${half} template literal
  'row__now',      // built by templates.mjs ledger() via the row__${half} template literal
  'walk__prev',    // built by series.js walkLink(pair, side)
  'walk__next',    // built by series.js walkLink(pair, side)
  'woff2',         // not a class: matched from the ".woff2" in url('…woff2') inside
                   // the @font-face src declarations (site.css:13,21) by the naive
                   // classSelectors regex, which scans the whole file for "." + word chars
]);
const classSelectors = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
for (const name of classSelectors) {
  if (CSS_ALLOWLIST.has(name)) continue;
  if (consumers.includes(name)) continue;
  fail(`dead CSS selector, nothing uses .${name}: assets/site.css`);
}

/* --- 7. dead manifest fields --- */
for (const pair of pairs) {
  if ('neighborhood' in pair) fail(`${pair.slug}: "neighborhood" is read by no code — remove it`);
  for (const half of HALVES) {
    if (pair[half] && 'sort' in pair[half]) fail(`${pair.slug}: "${half}.sort" is read by no code — remove it`);
  }
}

/* --- 8. the index ships a real link to every pair, before any script runs --- */
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const slug of slugs) {
  if (!indexHtml.includes(`href="pairs/${slug}.html"`)) {
    fail(`index.html has no static link to pairs/${slug}.html — the ledger is not crawlable`);
  }
}

/* --- 9. every responsive variant the templates reference actually exists --- */
const PLATE_WIDTHS_CHECK = [768, 1024, 1536, 2048];
const THUMB_WIDTHS_CHECK = [320, 640];
for (const pair of pairs) {
  for (const half of HALVES) {
    for (const ext of ['avif', 'webp', 'jpg']) {
      for (const w of PLATE_WIDTHS_CHECK) {
        if (w > pair.plate.width) continue;
        const p = path.join(ROOT, 'images', pair.slug, `${half}-${w}.${ext}`);
        if (!fs.existsSync(p)) fail(`missing variant: ${rel(p)} — run node tools/images.mjs`);
      }
      for (const w of THUMB_WIDTHS_CHECK) {
        const p = path.join(ROOT, 'images', pair.slug, `thumb-${half}-${w}.${ext}`);
        if (!fs.existsSync(p)) fail(`missing variant: ${rel(p)} — run node tools/images.mjs`);
      }
    }
  }
}

/* --- report --- */
if (failures.length) {
  console.error(`check: ${failures.length} failure(s)\n`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log(`check: ok — ${pairs.length} pairs, ${htmlFiles.length} pages`);

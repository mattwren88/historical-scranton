# Historical Scranton — Build Pipeline & Asset Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 13 hand-maintained, 87%-duplicated pair pages with a zero-dependency Node build that generates them from one manifest, ship responsive images, and remove dead code — without changing a single pixel of the rendered site.

**Architecture:** A `tools/` directory holds four small ES-module scripts (`manifest.mjs`, `templates.mjs`, `build.mjs`, `check.mjs`) run by `node`, no npm install, no `package.json` dependencies. `data/pairs.js` becomes the single source of truth for all page content. `node tools/build.mjs` writes `pairs/*.html` and injects a static ledger into `index.html`; `node tools/check.mjs` is the test suite. The **published output stays exactly what it is today** — plain static HTML/CSS/JS, openable from `file://`, no runtime dependencies. The build is an authoring convenience, not a deployment requirement.

**Tech Stack:** Node 26 (already installed, ESM only, no packages), ImageMagick 7 (`magick`, already installed, has AVIF + WebP delegates), git. No test framework — `tools/check.mjs` is the harness and is built first, in Task 1.

**Spec:** This plan is self-contained; the findings it implements are restated in "Findings Being Fixed" below.

---

## Findings Being Fixed

Each was verified against the working tree on 2026-09-07. Task numbers in brackets.

1. **Boilerplate duplication.** 13 pair pages, 1,264 total lines; 54 distinct lines appear *identically in all 13* (mode buttons, expand button, scale rail, hint text, six inline SVG icons). Only ~12 lines per page are genuinely unique. [Tasks 4, 5]
2. **Content stored twice, unsynchronised.** `title`, `location`, and both year labels live in *both* `data/pairs.js` and each HTML file. Nothing enforces agreement. [Tasks 4, 5]
3. **Index has no crawlable links.** `index.html` ships `<ul class="ledger" id="grid"></ul>` — empty. Every internal link is built by JS at runtime. A crawler that does not execute JS sees zero links to any of the 13 pages. No `<noscript>` either. [Task 6]
4. **Images: 8.9 MB, no responsive delivery.** Every plate is a full 2048px JPEG served identically to a 380px-wide phone. No `srcset`, no `<picture>`, no WebP/AVIF, no `preload` on the two above-the-fold plates. [Task 7]
5. **Orphan file.** `images/albright/now.webp` is referenced by nothing (`grep -rn "now.webp" index.html pairs data assets docs` → no matches). [Task 2]
6. **Dead CSS.** `.masthead__span` (`assets/site.css:164`) and `.topbar__series` (`assets/site.css:298`) have no matching markup anywhere. `assets/site.css:121-123` is an empty section banner ("Index — the series as a printed ledger") immediately followed by another banner. [Task 2]
7. **Dead manifest fields.** `then.sort` / `now.sort` and `neighborhood` appear on every entry and are read by no code. [Task 2]
8. **Dead parameter.** `walkLink(label, pair, side)` at `assets/series.js:133` never uses `label`; both call sites pass a string that is discarded. [Task 2]
9. **README is wrong.** It documents `assets/fonts/` holding "Bodoni Moda and Inter". Reality: `assets/cormorant-garamond.woff2` and `assets/lora.woff2`, no `fonts/` directory. It also states all plates are 2048×1271; three are not. [Task 3]
10. **`sources/` is 31 MB in git** — 21 tracked files, 3× the size of the shipped site, none of which is ever served. [Task 8]
11. **Duplicated boot code.** The `readyState`/`DOMContentLoaded` guard is copy-pasted into both `assets/slider.js` and `assets/series.js`. [Task 9]
12. **Fonts not preloaded** despite `font-display:swap` on the display face used by the masthead. [Task 9]

---

## Global Constraints

Copy these verbatim into your working memory. Every task's requirements implicitly include this section.

- **The rendered site must not change.** This is a refactor. Tasks 2–6 and 9 must produce byte-identical or semantically-identical rendered output. Task 7 changes image *delivery* only, not appearance. If a visual diff appears, you have a bug — stop and fix it, do not "improve" the design.
- **Zero runtime dependencies.** No npm packages, no CDN links, no framework. `tools/` scripts use only Node builtins (`node:fs`, `node:path`, `node:child_process`, `node:url`).
- **No `package.json` with dependencies.** A `package.json` containing only `{"type": "module"}` is permitted if `.mjs` extensions prove insufficient — they will not; prefer `.mjs` and skip the file entirely.
- **The site must keep working from `file://`.** Open `index.html` directly in a browser with no server. This is why the manifest is a `<script>`-assigned global rather than JSON fetched over the network — do not "fix" that.
- **`data/pairs.js` body stays plain JSON.** The file is a banner comment, then `window.SCRANTON_PAIRS = <plain JSON object>;`. `tools/manifest.mjs` slices out the object literal and `JSON.parse`s it. No trailing commas, no comments inside the object, no JS expressions.
- **Manifest prose fields are trusted HTML fragments, inserted raw.** `heading`, `standfirst`, `credits.*`, `blurb` may contain entities (`&eacute;`, `&mdash;`, `&nbsp;`) and tags (`<br>`). They are hand-authored by the repository owner and are NOT escaped at build time. This is a deliberate choice for a 13-page personal site with a single author; it preserves the existing typography exactly. Do not add an escaping layer. Do not accept these fields from any untrusted source.
- **Text-bearing attributes ARE escaped.** `alt`, `aria-label`, `<title>`, and `meta description` go through `attr()` in `tools/templates.mjs`. Content that is already an entity in the source stays an entity — `attr()` must be idempotent for `&amp;`/`&lt;`/`&gt;`/`&quot;` (see Task 5, Step 3).
- **Indentation:** 2 spaces in HTML and JS. Match the existing files.
- **Commit after every task.** Conventional-commit prefixes (`chore:`, `fix:`, `feat:`, `docs:`, `perf:`). Never commit a state where `node tools/check.mjs` fails.
- **Never run `git push --force`, `git filter-repo`, or `git rebase` without explicit user approval.** Task 8 depends on a user decision and must stop for it.

---

## File Structure

**Created:**

| Path | Responsibility |
|---|---|
| `tools/manifest.mjs` | Read and write `data/pairs.js`. The only place that knows the file's `window.SCRANTON_PAIRS = {...};` shape. |
| `tools/templates.mjs` | Pure functions: manifest entry → HTML string. `pairPage()`, `ledger()`, `attr()`. No file I/O. |
| `tools/build.mjs` | Writes `pairs/<slug>.html` for every manifest entry; injects the ledger into `index.html`. |
| `tools/check.mjs` | The test suite. Structural assertions over the repo. Exit 0 = pass, exit 1 = fail with a list. |
| `tools/migrate-pages.mjs` | **One-shot.** Parses the 13 existing pages into manifest fields. Deleted in Task 5. |
| `tools/images.mjs` | Generates responsive AVIF/WebP/JPEG variants via `magick`. Run manually, not part of `build.mjs`. |
| `docs/BUILD.md` | How to add a pair now that pages are generated. |

**Modified:**

| Path | Change |
|---|---|
| `data/pairs.js` | Gains per-page content fields; loses `sort` and `neighborhood`. |
| `index.html` | Ledger markers + static ledger; font preloads; `defer` on scripts. |
| `pairs/*.html` (13) | Become build output. Hand edits stop here. |
| `assets/site.css` | Remove 2 dead rules + 1 empty banner; add `display:contents` for `<picture>`. |
| `assets/series.js` | Drop dead param; drop ledger rendering (now static); share boot helper. |
| `assets/slider.js` | Share boot helper. |
| `README.md` | Correct the fonts, the directory layout, the plate dimensions; document the build. |
| `.gitignore` | Add `sources/` (Task 8). |

**Deleted:** `images/albright/now.webp`, `tools/migrate-pages.mjs` (after Task 5).

---

## Task 0: Preflight — get to a clean, committed baseline

The working tree is dirty: 23 modified/untracked paths, including three complete new pairs (`spruce-street-trolley`, `st-charles-hotel`, `wyoming-ave-theater-row`) whose images, pages and sources are **untracked** but already listed in the manifest. Nothing below is safe until this is committed.

**Files:** none created; git state only.

- [ ] **Step 1: See exactly what is uncommitted**

```bash
cd /Users/matthewwren/Documents/historical-scranton
git status --short
git diff --stat
```

- [ ] **Step 2: Confirm the three new pairs are complete**

```bash
for s in spruce-street-trolley st-charles-hotel wyoming-ave-theater-row; do
  echo "== $s"
  ls pairs/$s.html images/$s/ 2>&1
done
```

Expected: each has `pairs/<slug>.html` plus `then.jpg`, `now.jpg`, `thumb-then.jpg`, `thumb-now.jpg`. If any file is missing, STOP and report to the user — do not proceed with an incomplete pair in the manifest.

- [ ] **Step 3: Commit the baseline**

```bash
git add -A
git commit -m "chore: commit working state before build-pipeline refactor"
```

- [ ] **Step 4: Create the working branch**

```bash
git checkout -b build-pipeline
git log --oneline -1
```

- [ ] **Step 5: Snapshot the rendered pages for later comparison**

This snapshot is the ground truth that Task 5 diffs against. Do not skip it.

```bash
mkdir -p /tmp/hs-baseline
cp -R pairs /tmp/hs-baseline/pairs
cp index.html /tmp/hs-baseline/index.html
ls /tmp/hs-baseline/pairs | wc -l   # expect 13
```

---

## Task 1: The verification harness

Nothing else in this plan is testable without this. Build it first, watch it fail on a real defect, then watch it pass.

**Files:**
- Create: `tools/manifest.mjs`
- Create: `tools/check.mjs`

**Interfaces:**
- Produces: `readManifest(root) -> {pairs: Array<Pair>}` and `writeManifest(root, manifest) -> void` from `tools/manifest.mjs`. Every later task imports these. `root` is an absolute path to the repository root.
- Produces: `node tools/check.mjs` exits 0 on pass, 1 on failure, printing one line per failure.

- [ ] **Step 1: Write `tools/manifest.mjs`**

```js
/* Read and write data/pairs.js.
   That file is a <script> which assigns a plain-JSON object literal to a
   global, so the site works when opened from file:// with no server. Node has
   no `window`, and evaluating site code inside the build would be a needless
   trapdoor, so slice the object literal out of the text and JSON.parse it.
   If the file ever stops being plain JSON, this throws loudly — which is the
   intent. See "Global Constraints" in the plan. */
import fs from 'node:fs';
import path from 'node:path';

const BANNER = `/* The manifest for the whole series: the grid order, the prev/next order, and
   every card's text all come from here.

   This is a .js file rather than .json on purpose. A <script> tag is not subject
   to the cross-origin rule that blocks fetch() on file:// URLs, so the site works
   when you open index.html straight off disk — no local server needed. The body
   below is plain JSON; edit it exactly as you would a .json file.

   pairs/*.html is GENERATED from this file by tools/build.mjs. Edit here, then
   run: node tools/build.mjs */
`;

export function manifestPath(root) {
  return path.join(root, 'data', 'pairs.js');
}

export function readManifest(root) {
  const src = fs.readFileSync(manifestPath(root), 'utf8');
  const assign = src.indexOf('window.SCRANTON_PAIRS');
  if (assign < 0) throw new Error('data/pairs.js: no window.SCRANTON_PAIRS assignment found');
  const start = src.indexOf('{', assign);
  const end = src.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('data/pairs.js: could not locate the object literal');
  return JSON.parse(src.slice(start, end + 1));
}

export function writeManifest(root, manifest) {
  const body = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(manifestPath(root), BANNER + '\nwindow.SCRANTON_PAIRS = ' + body + ';\n');
}
```

Note: `writeManifest` reformats the file with uniform 2-space JSON. The current hand-aligned columns (`"now":  { "year": "Today",   "sort": null }`) are lost. That is expected and acceptable — the file is data, and it is now generated-adjacent.

- [ ] **Step 2: Write `tools/check.mjs`**

```js
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
  'row__then',     // built by series.js thumb(pair, half)
  'row__now',      // built by series.js thumb(pair, half)
  'walk__prev',    // built by series.js walkLink(pair, side)
  'walk__next',    // built by series.js walkLink(pair, side)
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

/* --- report --- */
if (failures.length) {
  console.error(`check: ${failures.length} failure(s)\n`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log(`check: ok — ${pairs.length} pairs, ${htmlFiles.length} pages`);
```

- [ ] **Step 3: Create a stub `tools/templates.mjs` so check.mjs can read it**

Check rule 6 reads `tools/templates.mjs`; it does not exist until Task 5. Create the stub now.

```bash
cat > tools/templates.mjs <<'EOF'
/* Manifest entry -> HTML. Filled in by Task 5 of the build-pipeline plan. */
export const PLACEHOLDER = true;
EOF
```

- [ ] **Step 4: Run the checker and verify it FAILS on real, known defects**

```bash
node tools/check.mjs; echo "exit=$?"
```

Expected: `exit=1`, and among the failures you must see all of these — they are the defects Findings 5, 6 and 7 describe:

```
  ✗ orphan image, referenced by nothing: images/albright/now.webp
  ✗ dead CSS selector, nothing uses .masthead__span: assets/site.css
  ✗ dead CSS selector, nothing uses .topbar__series: assets/site.css
  ✗ terrace-hotel: "then.sort" is read by no code — remove it
  ✗ terrace-hotel: "neighborhood" is read by no code — remove it
```

If any of those five is absent, the checker is broken — fix it before continuing. Other failures may also appear (that is fine); Task 2 clears them.

- [ ] **Step 5: Commit**

```bash
git add tools/manifest.mjs tools/check.mjs tools/templates.mjs
git commit -m "test: add tools/check.mjs structural verification harness"
```

---

## Task 2: Remove dead code

The checker from Task 1 is currently red. Make it green.

**Files:**
- Modify: `data/pairs.js` (via script)
- Modify: `assets/site.css:121-123`, `:164-171`, `:298`
- Modify: `assets/series.js:133`, and its two call sites
- Delete: `images/albright/now.webp`

**Interfaces:**
- Consumes: `readManifest` / `writeManifest` from `tools/manifest.mjs` (Task 1).
- Produces: `walkLink(pair, side)` — signature changes from three parameters to two. Nothing outside `series.js` calls it.

- [ ] **Step 1: Delete the orphan image**

```bash
git rm images/albright/now.webp
```

- [ ] **Step 2: Strip `sort` and `neighborhood` from the manifest**

```bash
node --input-type=module -e '
import path from "node:path";
import { readManifest, writeManifest } from "./tools/manifest.mjs";
const ROOT = process.cwd();
const m = readManifest(ROOT);
for (const p of m.pairs) {
  delete p.neighborhood;
  for (const half of ["then", "now"]) if (p[half]) delete p[half].sort;
}
writeManifest(ROOT, m);
console.log("stripped from " + m.pairs.length + " pairs");
'
```

Expected output: `stripped from 13 pairs`

- [ ] **Step 3: Verify the manifest still parses and lost nothing else**

```bash
node --input-type=module -e '
import { readManifest } from "./tools/manifest.mjs";
const m = readManifest(process.cwd());
console.log(m.pairs.length, "pairs");
console.log(JSON.stringify(m.pairs[0], null, 2));
'
```

Expected: `13 pairs`, and the first entry is `terrace-hotel` with `slug`, `coords`, `streetview`, `title`, `shortTitle`, `location`, `then:{year}`, `now:{year}`, `blurb` — and **no** `neighborhood`, **no** `sort`.

- [ ] **Step 4: Delete the two dead CSS rules and the empty banner**

Remove from `assets/site.css`:

The empty section banner at lines 121-123 (it is immediately followed by another banner, so it labels nothing):

```css
/* ==========================================================================
   Index — the series as a printed ledger
   ========================================================================== */
```

The `.masthead__span` rule (no markup anywhere uses it):

```css
.masthead__span{
  margin:0;
  text-align:right;
  font-size:12px;
  line-height:1.5;
  color:var(--n-700);
  font-feature-settings:'tnum';
}
```

The `.topbar__series` rule (same):

```css
.topbar__series{color:var(--n-700)}
```

And in the `@media (max-width:860px)` block at the end, the now-orphaned line:

```css
  .masthead__span{text-align:left}
```

- [ ] **Step 5: Drop the unused `label` parameter in `series.js`**

In `assets/series.js`, replace:

```js
  function walkLink(label, pair, side) {
```

with:

```js
  function walkLink(pair, side) {
```

Then in `renderNav`, replace:

```js
    if (pairs[i - 1]) walk.appendChild(walkLink('Previous', pairs[i - 1], 'prev'));
    if (pairs[i + 1]) walk.appendChild(walkLink('Next', pairs[i + 1], 'next'));
```

with:

```js
    if (pairs[i - 1]) walk.appendChild(walkLink(pairs[i - 1], 'prev'));
    if (pairs[i + 1]) walk.appendChild(walkLink(pairs[i + 1], 'next'));
```

- [ ] **Step 6: Run the checker and verify it PASSES**

```bash
node tools/check.mjs; echo "exit=$?"
```

Expected: `check: ok — 13 pairs, 14 pages` and `exit=0`.

If a `dead CSS selector` failure remains for a class you believe *is* used, do not delete the rule reflexively — grep for it first, and if it is applied by script through a computed name, add it to `CSS_ALLOWLIST` in `tools/check.mjs` **with a comment saying where it is applied**.

- [ ] **Step 7: Verify no visual change in a browser**

```bash
python3 -m http.server 8000 &
echo "open http://localhost:8000/ and http://localhost:8000/pairs/albright.html"
```

Confirm by eye: the masthead, the topbar, the ledger rows and hover reveal, and prev/next links at the bottom of the pair page all look and behave exactly as before. Then `kill %1`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: remove dead CSS rules, unused manifest fields and unused parameter"
```

---

## Task 3: Correct the README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Verify the true state of the things the README describes**

```bash
ls assets/
for d in images/*/; do
  s=$(basename "$d")
  echo "$s: $(magick identify -format '%wx%h' "$d/then.jpg")"
done
```

Expected: `assets/` holds `cormorant-garamond.woff2`, `lora.woff2`, `favicon.svg`, `site.css`, `series.js`, `slider.js` — and no `fonts/` directory. Ten pairs are `2048x1271`; `spruce-street-trolley` is `1476x1202`, `st-charles-hotel` is `1547x2048`, `wyoming-ave-theater-row` is `2048x1530`.

- [ ] **Step 2: Replace the "Layout" block in `README.md`**

Replace the existing fenced block under `## Layout` with:

```
index.html              the grid of every pair — generated ledger, see docs/BUILD.md
pairs/<slug>.html       one page per location — GENERATED, do not hand-edit
assets/
  site.css              design tokens and every style in the series
  slider.js             the comparison widget
  series.js             reads the manifest, builds prev/next and the "Where" credit
  cormorant-garamond.woff2   display face, latin subset
  lora.woff2                 body face, latin subset
  favicon.svg
images/<slug>/
  then.jpg  now.jpg     the aligned plates; most are 2048×1271, but the ratio
                        is per-pair — see "plate" in the manifest
  thumb-then.jpg  thumb-now.jpg    640×397, for the index cards
sources/<slug>/         originals, kept out of the site (and out of git)
data/pairs.js           the manifest — the single source of truth for all page text
tools/                  the build: node tools/build.mjs, node tools/check.mjs
docs/                   notes on making these
```

- [ ] **Step 3: Add a "Build" section to `README.md`, immediately after "Preview locally"**

````markdown
## Build

Pair pages are generated from `data/pairs.js`. After editing the manifest:

```sh
node tools/build.mjs     # regenerate pairs/*.html and the index ledger
node tools/check.mjs     # verify every reference resolves
```

No npm install — the scripts use only Node builtins. The *output* has no build
step and no dependencies; it is the same static site it always was, and still
opens straight from disk.

Full instructions for adding a pair are in [docs/BUILD.md](docs/BUILD.md).
````

- [ ] **Step 4: Verify no other stale claim survives**

```bash
grep -niE "bodoni|inter|assets/fonts|2048×1271|2048x1271" README.md
```

Expected: only the line inside the layout block that now explicitly says the ratio is per-pair. Any hit mentioning Bodoni, Inter, or `assets/fonts` is a miss — fix it.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: correct README fonts, layout and plate dimensions"
```

---

## Task 4: Migrate page content into the manifest

Parse all 13 existing pages and move every unique field into `data/pairs.js`. This task adds data only — it does not yet change any page. Verified on 2026-09-07: all 13 pages match the regexes below.

**Files:**
- Create: `tools/migrate-pages.mjs` (one-shot; deleted at the end of Task 5)
- Modify: `data/pairs.js`

**Interfaces:**
- Consumes: `readManifest` / `writeManifest` from `tools/manifest.mjs`.
- Produces: each manifest entry gains these fields, which `tools/templates.mjs` consumes in Task 5:

```
pageTitle    string  — verbatim <title> minus the " — Then &amp; Now" suffix.
                       NOT derivable from `title`: lackawanna-ave-bridge is
                       "The Lackawanna Avenue Bridge" in `title` but
                       "Lackawanna Avenue Bridge" in <title>; spruce-street-trolley
                       is "The Last Streetcar" vs "The Last Streetcar, Spruce Street".
description  string  — verbatim meta description content.
heading      string  — HTML fragment, the <h1> inner HTML (contains <br> and &nbsp;).
standfirst   string  — HTML fragment, the <p class="standfirst"> inner HTML.
compareLabel string  — verbatim range aria-label. NOT derivable: dickson says
                       "Compare the 1890s with today", manifest year is "c. 1895".
plate        {width:number, height:number} — intrinsic pixels of then.jpg/now.jpg.
then.alt     string  — verbatim alt text of .plate--then.
now.alt      string  — verbatim alt text of .plate--now.
then.credit  string  — HTML fragment, the "Then" <td>.
now.credit   string  — HTML fragment, the "Now" <td>.
fit          string|undefined — HTML fragment, the "On the fit" <td>.
                       Absent on high-school, which has only 2 credit rows.
```

- [ ] **Step 1: Write `tools/migrate-pages.mjs`**

```js
/* ONE-SHOT. Lifts the unique content out of the 13 hand-written pair pages and
   into data/pairs.js, so tools/build.mjs can regenerate them. Delete this file
   once Task 5 confirms the generated pages match the originals. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readManifest, writeManifest } from './manifest.mjs';

const ROOT = process.cwd();
const manifest = readManifest(ROOT);
const problems = [];

/* Every regex below was verified to match all 13 pages before this was written.
   A miss is a real inconsistency in the source page, not a regex to loosen —
   it gets reported and the run aborts. */
function must(re, html, slug, what) {
  const m = html.match(re);
  if (!m) { problems.push(`${slug}: could not find ${what}`); return null; }
  return m[1].trim();
}

for (const pair of manifest.pairs) {
  const file = path.join(ROOT, 'pairs', `${pair.slug}.html`);
  const html = fs.readFileSync(file, 'utf8');
  const s = pair.slug;

  const rawTitle = must(/<title>(.*?)<\/title>/, html, s, '<title>');
  pair.pageTitle = rawTitle ? rawTitle.replace(/\s*—\s*Then &amp; Now$/, '') : rawTitle;

  pair.description  = must(/<meta name="description" content="(.*?)">/, html, s, 'meta description');
  pair.heading      = must(/<h1 class="display pair-title">([\s\S]*?)<\/h1>/, html, s, '<h1>');
  pair.compareLabel = must(/aria-label="(Compare[^"]*)"/, html, s, 'range aria-label');

  const standfirst = must(/<p class="standfirst">([\s\S]*?)<\/p>/, html, s, 'standfirst');
  /* The source pages wrap the standfirst at inconsistent indents; collapse to
     single spaces so the template controls the whitespace from here on. */
  pair.standfirst = standfirst ? standfirst.replace(/\s+/g, ' ').trim() : standfirst;

  const now  = html.match(/class="plate--now"\s+src="([^"]+)"\s+width="(\d+)" height="(\d+)"\s*\n?\s*alt="([^"]*)"/);
  const then = html.match(/class="plate--then" src="([^"]+)" width="(\d+)" height="(\d+)"\s*\n?\s*alt="([^"]*)"/);
  if (!now || !then) { problems.push(`${s}: could not parse the two plate <img> tags`); continue; }

  if (now[2] !== then[2] || now[3] !== then[3]) {
    problems.push(`${s}: then and now declare different dimensions (${then[2]}x${then[3]} vs ${now[2]}x${now[3]})`);
  }
  pair.plate = { width: Number(now[2]), height: Number(now[3]) };
  pair.now.alt  = now[4];
  pair.then.alt = then[4];

  /* Cross-check the declared dimensions against the actual files. A wrong
     width/height causes layout shift, so catch it here rather than never. */
  for (const half of ['then', 'now']) {
    const img = path.join(ROOT, 'images', s, `${half}.jpg`);
    const real = execFileSync('magick', ['identify', '-format', '%w %h', img], { encoding: 'utf8' })
      .trim().split(' ').map(Number);
    if (real[0] !== pair.plate.width || real[1] !== pair.plate.height) {
      problems.push(`${s}: ${half}.jpg is ${real[0]}x${real[1]} but the page declares ${pair.plate.width}x${pair.plate.height}`);
    }
  }

  const cells = [...html.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => m[1].trim());
  if (cells.length < 2) { problems.push(`${s}: expected at least 2 credit cells, found ${cells.length}`); continue; }
  pair.then.credit = cells[0];
  pair.now.credit  = cells[1];
  if (cells.length >= 3) pair.fit = cells[2];
  if (cells.length > 3) problems.push(`${s}: ${cells.length} credit cells — the template only renders 3`);
}

if (problems.length) {
  console.error('migration aborted:\n');
  for (const p of problems) console.error('  ✗ ' + p);
  process.exit(1);
}

writeManifest(ROOT, manifest);
console.log(`migrated ${manifest.pairs.length} pairs into data/pairs.js`);
```

- [ ] **Step 2: Run the migration**

```bash
node tools/migrate-pages.mjs
```

Expected: `migrated 13 pairs into data/pairs.js`, exit 0.

If it aborts, the listed page really is inconsistent with the other twelve. Read the reported page, fix the *page* to match the common shape, and re-run. Do not loosen the regexes.

- [ ] **Step 3: Verify the migrated data against the source pages, field by field**

```bash
node --input-type=module -e '
import { readManifest } from "./tools/manifest.mjs";
const m = readManifest(process.cwd());
const p = m.pairs.find(x => x.slug === "albright");
console.log(JSON.stringify(p, null, 2));
'
```

Expected — check each of these against `pairs/albright.html` by eye:

- `pageTitle` is `"Albright Memorial Library"` (the `— Then &amp; Now` suffix stripped)
- `heading` is `"Albright<br>Memorial&nbsp;Library"` — entities and `<br>` preserved
- `plate` is `{ "width": 2048, "height": 1271 }`
- `compareLabel` is `"Compare around 1900 with today. Drag, or use the arrow keys."`
- `then.credit` starts `"Photograph, &ldquo;Scranton Public Library"` — entities preserved
- `fit` is present and starts `"The building is essentially unaltered"`

- [ ] **Step 4: Verify the two structural edge cases specifically**

```bash
node --input-type=module -e '
import { readManifest } from "./tools/manifest.mjs";
const m = readManifest(process.cwd());
const hs = m.pairs.find(x => x.slug === "high-school");
console.log("high-school has fit?", "fit" in hs, "(expect false — it has only 2 credit rows)");
for (const slug of ["st-charles-hotel","spruce-street-trolley","wyoming-ave-theater-row"]) {
  const p = m.pairs.find(x => x.slug === slug);
  console.log(slug, JSON.stringify(p.plate));
}
'
```

Expected exactly:

```
high-school has fit? false (expect false — it has only 2 credit rows)
st-charles-hotel {"width":1547,"height":2048}
spruce-street-trolley {"width":1476,"height":1202}
wyoming-ave-theater-row {"width":2048,"height":1530}
```

- [ ] **Step 5: Confirm every pair got every required field**

```bash
node --input-type=module -e '
import { readManifest } from "./tools/manifest.mjs";
const REQUIRED = ["slug","title","shortTitle","location","blurb","pageTitle","description","heading","standfirst","compareLabel","plate"];
let bad = 0;
for (const p of readManifest(process.cwd()).pairs) {
  const missing = REQUIRED.filter(k => p[k] === undefined || p[k] === null || p[k] === "");
  for (const half of ["then","now"]) {
    for (const k of ["year","alt","credit"]) {
      if (!p[half] || !p[half][k]) missing.push(half + "." + k);
    }
  }
  if (missing.length) { console.log("✗", p.slug, "missing:", missing.join(", ")); bad++; }
}
console.log(bad ? bad + " pairs incomplete" : "all 13 pairs complete");
'
```

Expected: `all 13 pairs complete`. Anything else — fix before continuing; Task 5 will render blanks otherwise.

- [ ] **Step 6: Run the checker**

```bash
node tools/check.mjs; echo "exit=$?"
```

Expected: `exit=0`. The pages have not changed yet, so this simply confirms nothing regressed.

- [ ] **Step 7: Commit**

```bash
git add tools/migrate-pages.mjs data/pairs.js
git commit -m "refactor: lift pair page content into the manifest"
```

---

## Task 5: Generate the pair pages

The payoff task. 13 pages become build output; the source of truth is one file.

**Files:**
- Modify: `tools/templates.mjs` (replace the Task 1 stub)
- Create: `tools/build.mjs`
- Modify: `pairs/*.html` (all 13, as generated output)
- Delete: `tools/migrate-pages.mjs`

**Interfaces:**
- Consumes: every field added in Task 4; `readManifest` from `tools/manifest.mjs`.
- Produces: `attr(s)` — escape for an HTML attribute value, idempotent for existing entities. `pairPage(pair)` — full HTML document string. `ledger(pairs, root)` — the `<li>` list for the index (used in Task 6). All exported from `tools/templates.mjs`.
- Produces: `node tools/build.mjs` writes all 13 pair pages and exits 0.

- [ ] **Step 1: Extract the shared chrome exactly as it exists today**

Before writing the template, capture the literal markup so the template reproduces it byte-for-byte:

```bash
sed -n '31,56p' pairs/albright.html
```

This is the `<span class="seam">` through `</div>` of `.modes` plus the hint — the 54 lines that are identical across all 13 pages. Copy it verbatim into the template in Step 2. Do not retype it from memory.

- [ ] **Step 2: Write `tools/templates.mjs`**

```js
/* Manifest entry -> HTML string. Pure functions, no file I/O.

   Prose fields (heading, standfirst, credits, blurb) are trusted, hand-authored
   HTML fragments and are inserted RAW so the existing typography — &eacute;,
   &mdash;, &nbsp;, <br> — survives untouched. Attribute values go through
   attr(). See "Global Constraints" in the plan. */

/* Escape for an attribute value. Idempotent: text arriving from the manifest
   already carries entities (&amp;, &rsquo;), and double-escaping them would
   render "&amp;amp;" to the user. The negative lookahead on & leaves an
   existing entity alone and escapes a bare ampersand. */
export function attr(s) {
  return String(s)
    .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function plateImg(pair, half) {
  const { width, height } = pair.plate;
  return `<img class="plate--${half}" src="../images/${pair.slug}/${half}.jpg" width="${width}" height="${height}"
             alt="${attr(pair[half].alt)}" draggable="false">`;
}

const ICON_THEN = '<svg class="icon icon--gold" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20"/><path d="M7 4v5"/></svg>';
const ICON_NOW  = '<svg class="icon icon--gold" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>';
const ICON_FIT  = '<svg class="icon icon--gold" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>';
const ICON_PIN  = '<svg class="icon icon--gold" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';

function credits(pair) {
  const rows = [
    ['Then', ICON_THEN, pair.then.credit],
    ['Now',  ICON_NOW,  pair.now.credit],
  ];
  if (pair.fit) rows.push(['On the fit', ICON_FIT, pair.fit]);
  return rows.map(([label, icon, cell]) => `          <tr>
            <th scope="row"><span>${icon}${label}</span></th>
            <td>${cell}</td>
          </tr>`).join('\n');
}

export function pairPage(pair) {
  return `<!doctype html>
<html lang="en" data-root="../">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${attr(pair.pageTitle)} &mdash; Then &amp; Now</title>
<meta name="description" content="${attr(pair.description)}">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/site.css">
</head>
<body data-pair="${pair.slug}">
<main class="page">

  <nav class="topbar">
    <a href="../index.html">&larr; All views</a>
    <a class="mark mark--bar" href="../index.html" aria-label="Historical Scranton, all views">
      <span class="mark__then">Historical</span>
      <span class="mark__seam" aria-hidden="true"></span>
      <span class="mark__now">Scranton</span>
    </a>
  </nav>

  <div class="pair">

    <div class="comparison" data-mode="slide" style="--plate:${pair.plate.width}/${pair.plate.height}">
      <div class="stage plate">
        ${plateImg(pair, 'now')}
        ${plateImg(pair, 'then')}
        <span class="seam"></span>
        <input class="range" type="range" min="0" max="100" step="0.1" value="50"
               aria-label="${attr(pair.compareLabel)}">
        <button class="expand" type="button" aria-pressed="false" aria-label="Expand the plate to full width">
          <svg class="icon expand__in" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2h-3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/></svg>
          <svg class="icon expand__out" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v4a2 2 0 0 1-2 2H3"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/><path d="M15 21v-4a2 2 0 0 1 2-2h4"/><path d="M9 21v-4a2 2 0 0 0-2-2H3"/></svg>
        </button>
      </div>

      <div class="scale">
        <div class="scale__labels">
          <span class="yr yr--then">${pair.then.year}</span>
          <span class="readout"></span>
          <span class="yr yr--now">${pair.now.year}</span>
        </div>
        <div class="scale__rule"><span class="scale__tick"></span></div>
      </div>

      <div class="modes">
        <button class="mode" type="button" data-mode="slide" aria-pressed="true"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/></svg>Slide</button>
        <button class="mode" type="button" data-mode="fade" aria-pressed="false"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z" fill="currentColor" stroke="none"/></svg>Fade</button>
        <button class="mode" type="button" data-mode="blink" aria-pressed="false"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>Blink</button>
      </div>

      <p class="hint"><svg class="icon icon--gold" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 16-4-4 4-4"/></svg><span class="hint__text">Drag anywhere on the plate &middot; arrow keys to scrub</span></p>
    </div>

    <aside class="sidecar">
      <h1 class="display pair-title">${pair.heading}</h1>
      <p class="where">${ICON_PIN}${pair.location}</p>
      <p class="standfirst">
        ${pair.standfirst}
      </p>

      <table class="credits">
        <tbody>
${credits(pair)}
        </tbody>
      </table>

      <nav class="walk" id="walk" aria-label="Other views in the series"></nav>
    </aside>

  </div>

</main>

<script src="../data/pairs.js"></script>
<script src="../assets/slider.js"></script>
<script src="../assets/series.js"></script>
</body>
</html>
`;
}

/* The index ledger, rendered statically so the pages are crawlable without JS.
   Mirrors what series.js builds at runtime; Task 6 retires that runtime path. */
const ICON_PIN_ROW = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';
const ICON_SWAP = '<svg class="icon icon--gold" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8l4 4-4 4M2 12h20M6 16l-4-4 4-4"/></svg>';
const ICON_CHEVRON = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

export function ledger(pairs) {
  return pairs.map((pair, i) => {
    const lazy = i >= 2 ? ' loading="lazy"' : '';
    const where = pair.location
      ? `\n        <p class="row__where">${ICON_PIN_ROW}${pair.location}</p>` : '';
    const blurb = pair.blurb
      ? `\n        <p class="row__blurb">${pair.blurb}</p>` : '';
    return `    <li>
      <a class="row" href="pairs/${pair.slug}.html">
        <span class="row__frame plate">
          <img class="row__now" src="images/${pair.slug}/thumb-now.jpg" width="640" height="397" decoding="async"${lazy} alt="${attr(pair.title)}, today">
          <img class="row__then" src="images/${pair.slug}/thumb-then.jpg" width="640" height="397" decoding="async"${lazy} alt="" aria-hidden="true">
        </span>
        <div>
          <h2 class="row__title">${pair.shortTitle || pair.title}</h2>${where}${blurb}
        </div>
        <p class="row__years">${pair.then.year}<span class="row__to">${ICON_SWAP}${pair.now.year.toLowerCase()}</span></p>
        <span class="row__mark">${ICON_CHEVRON}</span>
      </a>
    </li>`;
  }).join('\n');
}
```

- [ ] **Step 3: Prove `attr()` is idempotent before trusting it with 13 pages**

```bash
node --input-type=module -e '
import { attr } from "./tools/templates.mjs";
const cases = [
  ["Green &amp; Wicks",        "Green &amp; Wicks"],
  ["Green & Wicks",            "Green &amp; Wicks"],
  ["it&rsquo;s",               "it&rsquo;s"],
  ["Scranton's \"best\"", "Scranton's &quot;best&quot;"],
  ["a < b",                    "a &lt; b"],
];
let bad = 0;
for (const [input, want] of cases) {
  const got = attr(input);
  const ok = got === want;
  if (!ok) bad++;
  console.log(ok ? "ok  " : "FAIL", JSON.stringify(input), "->", JSON.stringify(got));
}
const twice = attr(attr("Green & Wicks"));
console.log(twice === "Green &amp; Wicks" ? "ok   idempotent" : "FAIL idempotent -> " + twice);
process.exit(bad ? 1 : 0);
'
```

Expected: five `ok` lines plus `ok   idempotent`, exit 0. If `&amp;` becomes `&amp;amp;`, the lookahead in `attr()` is wrong — fix it here, not downstream.

- [ ] **Step 4: Write `tools/build.mjs`**

```js
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
```

- [ ] **Step 5: Build, and diff every page against the Task 0 snapshot**

This is the real test of this task. The generated pages must be *semantically* identical to the hand-written originals. Whitespace between tags may differ; nothing else may.

```bash
node tools/build.mjs
```

Expected: `built 13 pair pages` and the index-skip line.

Now compare, normalising only inter-tag whitespace:

```bash
node --input-type=module -e '
import fs from "node:fs";
const norm = (s) => s
  .replace(/>\s+</g, "><")
  .replace(/\s+/g, " ")
  .trim();
let bad = 0;
for (const f of fs.readdirSync("pairs").filter(f => f.endsWith(".html"))) {
  const a = norm(fs.readFileSync("/tmp/hs-baseline/pairs/" + f, "utf8"));
  const b = norm(fs.readFileSync("pairs/" + f, "utf8"));
  if (a === b) { console.log("ok   " + f); continue; }
  bad++;
  console.log("DIFF " + f);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      console.log("  at " + i);
      console.log("  was: ..." + a.slice(Math.max(0, i - 60), i + 90));
      console.log("  now: ..." + b.slice(Math.max(0, i - 60), i + 90));
      break;
    }
  }
}
console.log(bad ? bad + " page(s) differ" : "all 13 pages match the baseline");
process.exit(bad ? 1 : 0);
'
```

Expected: 13 `ok` lines and `all 13 pages match the baseline`, exit 0.

**Two differences are expected and acceptable** — investigate any others:

1. `<title>` now emits `&mdash;` where the source had a literal `—`. These render identically. If you would rather keep the literal character, change `&mdash;` to `—` in `pairPage()` and re-run.
2. The three non-2048×1271 pairs already carried `style="--plate:..."`; the ten others did not, and now all thirteen do. The value for the ten is `2048/1271`, identical to the `:root` default, so nothing renders differently.

If any *other* page differs, the template is wrong. Read the diff context printed above, fix `templates.mjs`, re-run. Do not edit the generated page.

- [ ] **Step 6: Verify in a browser that the pages still work**

```bash
python3 -m http.server 8000 &
```

Open `http://localhost:8000/pairs/st-charles-hotel.html` (the portrait one — the plate ratio is the thing most likely to break) and `http://localhost:8000/pairs/high-school.html` (the one with only two credit rows). On each, confirm:

- The plate is the right shape, not cropped or letterboxed.
- Dragging moves the seam; the readout updates.
- Fade and Blink both work.
- The expand button grows the plate and the sidecar drops below.
- Prev/next links appear at the bottom, and the "Where" row appears in the credits table (on `st-charles-hotel`, which has coords; `high-school` has none and correctly shows no Where row).

Then `kill %1`.

- [ ] **Step 7: Confirm the site still works from `file://`**

```bash
open index.html
```

Click through to a pair page. If the manifest fails to load you will see the error paragraph from `series.js`. Everything must work with no server — this is a hard constraint.

- [ ] **Step 8: Delete the one-shot migration script**

```bash
git rm tools/migrate-pages.mjs
```

- [ ] **Step 9: Run the checker**

```bash
node tools/check.mjs; echo "exit=$?"
```

Expected: `exit=0`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: generate pair pages from the manifest

13 hand-maintained pages of 87% duplicated markup become build output of
tools/build.mjs. Rendered HTML is unchanged."
```

---

## Task 6: Static, crawlable index ledger

The ledger currently exists only after JS runs. Make it real HTML, and retire the runtime path that built it.

**Files:**
- Modify: `index.html`
- Modify: `assets/series.js` (remove `row`, `thumb`, `renderLedger`, `fail`)
- Modify: `tools/check.mjs` (add a crawlability rule)

**Interfaces:**
- Consumes: `ledger(pairs)` from `tools/templates.mjs` (Task 5).
- Produces: `index.html` contains one `<a href="pairs/<slug>.html">` per pair in the served HTML, before any script runs.

- [ ] **Step 1: Add the ledger markers to `index.html`**

Replace this line:

```html
  <ul class="ledger" id="grid"></ul>
```

with:

```html
  <ul class="ledger" id="grid">
    <!-- ledger:start -->
    <!-- ledger:end -->
  </ul>
```

- [ ] **Step 2: Build, and confirm the ledger is injected**

```bash
node tools/build.mjs
grep -c 'class="row" href="pairs/' index.html
```

Expected: `built 13 pair pages`, `injected the index ledger`, and the grep prints `13`.

- [ ] **Step 3: Verify the static ledger renders identically to the old JS-built one**

```bash
python3 -m http.server 8000 &
```

Open `http://localhost:8000/`. Confirm: 13 rows, correct order (Hotel Terrace first, The Last Streetcar last), hover reveals the historical thumbnail, hover shows the gold chevron, and the years column reads e.g. `c. 1900 ⇄ today`.

Then disable JavaScript in the browser (Chrome: DevTools → ⋮ → Settings → Debugger → Disable JavaScript) and reload. **The ledger must still be fully there and every link must work.** This is the point of the task. Then `kill %1`.

- [ ] **Step 4: Remove the now-dead runtime ledger code from `assets/series.js`**

Delete these functions entirely — the static ledger replaces them:

- `thumb(pair, half)`
- `row(pair, index)`
- `renderLedger(grid, pairs)`
- `fail(message)`

In `boot()`, delete these lines:

```js
    var grid = document.getElementById('grid');
    if (grid) renderLedger(grid, pairs);
```

and replace the manifest guard:

```js
    var manifest = window.SCRANTON_PAIRS;
    if (!manifest || !manifest.pairs) {
      fail('The manifest did not load. Check that data/pairs.js is present and that ' +
           'this page includes its <script> tag before assets/series.js.');
      return;
    }
```

with:

```js
    // The ledger is static HTML now; the manifest only drives the pair pages'
    // prev/next links and the "Where" credit. A missing manifest degrades to a
    // page without those, rather than to a page without content.
    var manifest = window.SCRANTON_PAIRS;
    if (!manifest || !manifest.pairs) return;
```

`series.js` no longer needs `swap`, `pin` (the row variant) or the `thumb` helper's icons except for `pin`, `chevron` and `chevronLeft`, which the "Where" row and prev/next still use. Leave `ICONS` intact — `swap` becomes unused, so remove just that one entry:

```js
  var ICONS = {
    pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z',
    chevron: 'M9 18l6-6-6-6',
    chevronLeft: 'M15 18l-6-6 6-6'
  };
```

Keep the `span()`, `icon()`, `url()` and `pageFor()` helpers — `renderWhere()`, `walkLink()` and `renderNav()` all still use them. After the deletions, `series.js` should be roughly half its former length and contain exactly: `ROOT`, `ICONS`, `url`, `pageFor`, `icon`, `span`, `walkLink`, `formatCoord`, `mapLink`, `renderWhere`, `renderNav`, `boot`. Verify that list:

```bash
grep -n '^  function \|^  var ' assets/series.js
```

- [ ] **Step 5: Remove the now-dead `.grid-error` rule from `assets/site.css`**

`fail()` was the only thing that applied it:

```css
.grid-error{margin:0;padding:20px 0;font-size:14px;color:var(--accent-700)}
```

- [ ] **Step 6: Add a crawlability rule to `tools/check.mjs`**

Insert before the `/* --- report --- */` block:

```js
/* --- 8. the index ships a real link to every pair, before any script runs --- */
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const slug of slugs) {
  if (!indexHtml.includes(`href="pairs/${slug}.html"`)) {
    fail(`index.html has no static link to pairs/${slug}.html — the ledger is not crawlable`);
  }
}
```

- [ ] **Step 7: Verify the new rule catches a real regression**

Temporarily break it, confirm the checker notices, then restore:

```bash
cp index.html /tmp/index-good.html
node --input-type=module -e '
import fs from "node:fs";
fs.writeFileSync("index.html", fs.readFileSync("index.html","utf8").replace("pairs/albright.html", "pairs/BROKEN.html"));
'
node tools/check.mjs; echo "exit=$? (expect 1)"
cp /tmp/index-good.html index.html
```

Expected: exit 1, with `index.html has no static link to pairs/albright.html — the ledger is not crawlable` among the failures.

- [ ] **Step 8: Run the full checker on the restored tree**

```bash
node tools/check.mjs; echo "exit=$?"
```

Expected: `exit=0`.

- [ ] **Step 9: Verify the pair pages still get their prev/next and Where rows**

```bash
python3 -m http.server 8000 &
```

Open `http://localhost:8000/pairs/hotel-jermyn.html` with JS **enabled**. Confirm the "Where" row (coordinates + Street View link) is present in the credits table and prev/next links appear. Then `kill %1`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: ship a static, crawlable index ledger

The 13 internal links now exist in the served HTML instead of being built
by JS at runtime. Retires the runtime ledger path in series.js."
```

---

## Task 7: Responsive images

8.9 MB of full-size JPEGs go to every visitor including phones. This task adds AVIF/WebP variants at four widths and wires up `<picture>`, without changing what anything looks like.

**Files:**
- Create: `tools/images.mjs`
- Create: `images/<slug>/{then,now}-{768,1024,1536,2048}.{avif,webp,jpg}` (variants)
- Modify: `tools/templates.mjs` (`plateImg`, `ledger`)
- Modify: `assets/site.css` (`display:contents` for `<picture>`)
- Modify: `tools/check.mjs` (variant existence rule)
- Modify: `index.html`, `pairs/*.html` (regenerated)

**Interfaces:**
- Consumes: `pair.plate.{width,height}` and `pair.slug` from the manifest.
- Produces: `node tools/images.mjs` writes variants for every pair. Idempotent — skips a variant whose file already exists and is newer than its source.
- Produces: `plateImg(pair, half)` now returns a `<picture>` element wrapping the same `<img class="plate--{half}">`.

- [ ] **Step 1: Confirm ImageMagick can write both formats**

```bash
magick -list format | grep -iE '^\s*(AVIF|WEBP)'
```

Expected: both listed with `rw+`. Verified present on this machine on 2026-09-07 (ImageMagick 7.1.1-38, AVIF 1.18.2, libwebp 1.4.0). If either is missing, STOP and tell the user which delegate to install (`brew install imagemagick` usually covers both).

- [ ] **Step 2: Write `tools/images.mjs`**

```js
/* Generate responsive variants of every plate and thumbnail.
   Run after adding or replacing an image:  node tools/images.mjs

   Not called by build.mjs on purpose — encoding 13 pairs takes minutes, and
   the manifest changes far more often than the pixels do. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { readManifest } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Plate widths. The pair page's stage is 3/5 of a 1180px frame, but the expand
   button can grow it to the full frame, and the browser will not re-pick a
   candidate after that — so the ladder tops out at the expanded width. */
const PLATE_WIDTHS = [768, 1024, 1536, 2048];
/* Thumbnails sit in a 272px column; 640 covers it at 2x. */
const THUMB_WIDTHS = [320, 640];

const FORMATS = [
  { ext: 'avif', args: ['-quality', '55'] },
  { ext: 'webp', args: ['-quality', '72', '-define', 'webp:method=6'] },
  { ext: 'jpg',  args: ['-quality', '82', '-sampling-factor', '4:2:0', '-strip', '-interlace', 'Plane'] },
];

function newerThan(target, source) {
  if (!fs.existsSync(target)) return false;
  return fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs;
}

function variants(source, outDir, base, widths, intrinsicWidth) {
  let made = 0;
  for (const w of widths) {
    /* Never upscale: a 1476px-wide plate gets no 1536 or 2048 variant. */
    if (w > intrinsicWidth) continue;
    for (const { ext, args } of FORMATS) {
      const out = path.join(outDir, `${base}-${w}.${ext}`);
      if (newerThan(out, source)) continue;
      execFileSync('magick', [source, '-resize', `${w}x`, ...args, out]);
      made++;
    }
  }
  return made;
}

const { pairs } = readManifest(ROOT);
let total = 0;
for (const pair of pairs) {
  const dir = path.join(ROOT, 'images', pair.slug);
  for (const half of ['then', 'now']) {
    total += variants(path.join(dir, `${half}.jpg`), dir, half, PLATE_WIDTHS, pair.plate.width);
    total += variants(path.join(dir, `thumb-${half}.jpg`), dir, `thumb-${half}`, THUMB_WIDTHS, 640);
  }
  console.log(`  ${pair.slug}`);
}
console.log(`wrote ${total} variant file(s)`);
```

- [ ] **Step 3: Generate the variants**

```bash
node tools/images.mjs
```

This takes a few minutes. Expected: one line per slug, then a count. Ten pairs produce 4 widths × 3 formats × 2 halves = 24 plate variants each; `spruce-street-trolley` (1476px) and `st-charles-hotel` (1547px) skip the 1536 and 2048 rungs where they would upscale.

- [ ] **Step 4: Confirm the variants are actually smaller**

```bash
du -sh images/
ls -la images/albright/now-1024.* images/albright/now.jpg | awk '{printf "%8d  %s\n", $5, $9}'
```

Expected: `now-1024.avif` is roughly 40-70 KB, `now-1024.webp` roughly 60-100 KB, against `now.jpg` at 458 KB. If AVIF is *larger* than the JPEG at the same width, the quality setting is wrong — drop `-quality 55` to `45` and regenerate.

- [ ] **Step 5: Rerun `tools/images.mjs` and confirm it is idempotent**

```bash
node tools/images.mjs
```

Expected: `wrote 0 variant file(s)`. If it re-encodes everything, `newerThan` is broken.

- [ ] **Step 6: Add `display:contents` for `<picture>` in `assets/site.css`**

The plate `<img>` is absolutely positioned against `.stage`. Wrapping it in a `<picture>` would otherwise insert a static-position box between them and break the fill. `display:contents` removes the wrapper's box so the `<img>` positions against `.stage` exactly as it does today.

Add immediately after the `.stage img{...}` rule:

```css
/* <picture> exists only to offer format alternatives; it must not become a
   box, or the absolutely-positioned plate inside it would resolve against the
   wrapper instead of the stage. */
.stage picture,
.row__frame picture{display:contents}
```

- [ ] **Step 7: Replace `plateImg()` in `tools/templates.mjs`**

```js
const PLATE_WIDTHS = [768, 1024, 1536, 2048];
/* The stage is 3/5 of the frame until the expand button grows it to the full
   frame, and a browser will not re-pick a candidate after that — so `sizes`
   describes the expanded width. Costs mobile nothing (100vw there) and keeps
   an expanded plate sharp. */
const PLATE_SIZES = '(max-width: 860px) 100vw, (max-width: 1224px) calc(100vw - 88px), 1136px';

function srcset(slug, base, ext, intrinsicWidth) {
  return PLATE_WIDTHS
    .filter((w) => w <= intrinsicWidth)
    .map((w) => `../images/${slug}/${base}-${w}.${ext} ${w}w`)
    .join(', ');
}

function plateImg(pair, half) {
  const { width, height } = pair.plate;
  const s = pair.slug;
  return `<picture>
          <source type="image/avif" srcset="${srcset(s, half, 'avif', width)}" sizes="${PLATE_SIZES}">
          <source type="image/webp" srcset="${srcset(s, half, 'webp', width)}" sizes="${PLATE_SIZES}">
          <img class="plate--${half}" src="../images/${s}/${half}.jpg"
               srcset="${srcset(s, half, 'jpg', width)}" sizes="${PLATE_SIZES}"
               width="${width}" height="${height}"
               alt="${attr(pair[half].alt)}" draggable="false">
        </picture>`;
}
```

- [ ] **Step 8: Add preload hints for the two above-the-fold plates**

Preloading the *responsive* source needs `imagesrcset`/`imagesizes`, not a bare `href`. In `pairPage()`, insert immediately after the stylesheet `<link>`:

```js
<link rel="preload" as="image" type="image/avif"
      imagesrcset="${srcset(pair.slug, 'now', 'avif', pair.plate.width)}" imagesizes="${PLATE_SIZES}">
```

Preload only the `now` plate. The `then` plate is clipped to 50% at load and is not the LCP element; preloading both would double the critical bytes for no gain.

- [ ] **Step 9: Update the ledger thumbnails in `tools/templates.mjs`**

In `ledger()`, declare a `thumb` helper at the top of the `.map()` callback, immediately after the `lazy` line:

```js
    const thumb = (half, extra) => `<picture>
            <source type="image/avif" srcset="images/${pair.slug}/thumb-${half}-320.avif 320w, images/${pair.slug}/thumb-${half}-640.avif 640w" sizes="(max-width: 860px) 100vw, 272px">
            <source type="image/webp" srcset="images/${pair.slug}/thumb-${half}-320.webp 320w, images/${pair.slug}/thumb-${half}-640.webp 640w" sizes="(max-width: 860px) 100vw, 272px">
            <img class="row__${half}" src="images/${pair.slug}/thumb-${half}.jpg" srcset="images/${pair.slug}/thumb-${half}-320.jpg 320w, images/${pair.slug}/thumb-${half}-640.jpg 640w" sizes="(max-width: 860px) 100vw, 272px" width="640" height="397" decoding="async"${lazy} ${extra}>
          </picture>`;
```

Then replace the `<span class="row__frame plate">` block in the returned template
literal with:

```js
        <span class="row__frame plate">
          ${thumb('now', `alt="${attr(pair.title)}, today"`)}
          ${thumb('then', 'alt="" aria-hidden="true"')}
        </span>
```

Everything else in `ledger()` — the `<li>`, the `<a class="row">`, the title,
where, blurb, years and chevron — stays exactly as Task 5 left it.

- [ ] **Step 10: Teach `tools/check.mjs` to require the variants**

The orphan rule (rule 5) will now flag every variant, because `check.mjs` only knows about `srcset` in markup — which it already parses, so the plate and thumb variants *are* referenced and will pass. Add a positive rule so a *missing* variant fails too. Insert before `/* --- report --- */`:

```js
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
```

Rule 5 (the orphan check) needs no change: it already parses `srcset`, and after
Task 6 the ledger references every thumbnail variant in markup, so all of them
are seen as referenced. If rule 5 now reports orphaned variants, the ledger
template is not emitting what you think it is — read the generated `index.html`
before touching the checker.

- [ ] **Step 11: Rebuild and check**

```bash
node tools/build.mjs
node tools/check.mjs; echo "exit=$?"
```

Expected: `exit=0`. Any `missing variant` failure means Step 3 did not cover that pair — re-run `node tools/images.mjs`.

- [ ] **Step 12: Verify the browser actually picks a small variant**

```bash
python3 -m http.server 8000 &
```

Open `http://localhost:8000/pairs/albright.html` with DevTools → Network → Img, and **hard-reload**. Confirm:

- The plate requests are `.avif` files, not `.jpg` (in Chrome/Safari/Firefox, all of which support AVIF).
- At a 1400px-wide window the request is `now-1536.avif` or `now-2048.avif`; narrow the window to 500px and hard-reload — it should drop to `now-768.avif`.
- Total image transfer for the page is well under 500 KB, versus ~760 KB before.
- **The plate looks identical.** Compare against `/tmp/hs-baseline` by opening the old page from disk side by side. Any visible softness or colour shift means the quality settings are too aggressive.

Then check `http://localhost:8000/` the same way: the two above-the-fold thumbnails load eagerly, the rest lazily as you scroll. Then `kill %1`.

- [ ] **Step 13: Confirm `file://` still works**

```bash
open index.html
```

`<picture>` and `srcset` work over `file://`. Click into a pair page and confirm the plate appears. If it does not, a relative path in a `srcset` is wrong.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "perf: ship responsive AVIF/WebP variants for plates and thumbnails

Four widths per plate, two per thumbnail, three formats each, plus a preload
hint for the above-the-fold plate. Appearance is unchanged."
```

---

## Task 8: Get `sources/` out of git — REQUIRES A USER DECISION

**Do not start this task without asking the user first.** `sources/` is 31 MB across 21 tracked files. Removing it from *future* commits is safe and reversible. Removing it from *history* rewrites every commit hash and requires a force-push, which breaks any existing clone.

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`

- [ ] **Step 1: Measure, so the user is deciding on facts**

```bash
du -sh sources/
git ls-files sources | wc -l
git count-objects -vH | grep size-pack
```

- [ ] **Step 2: Ask the user, presenting both options**

Ask exactly this, and wait:

> `sources/` is 31 MB of working originals that never ship — 21 files, about 3× the size of the site itself. Two options:
>
> **A. Stop tracking it going forward (safe, recommended).** `sources/` is gitignored and removed from the index. History keeps the 31 MB, so a fresh clone still downloads it once, but the repo stops growing. Nothing breaks, no force-push, existing clones are fine.
>
> **B. Purge it from history entirely.** Requires `git filter-repo` and a force-push to GitHub. Every commit hash changes; anyone else's clone breaks and any open PR is invalidated. Only worth it if clone size actually bothers you.
>
> Which one? And either way — are these originals backed up somewhere outside this repo? Option B makes them unrecoverable from git.

- [ ] **Step 3 (Option A only): Untrack `sources/`**

```bash
printf '\n# Working originals — never served, kept out of the repo\nsources/\n' >> .gitignore
git rm -r --cached sources
git status --short | head
```

Expected: 21 deletions staged, and `sources/` still fully present on disk. **Verify that** — the files must not be gone:

```bash
ls sources/ | wc -l    # expect 13
du -sh sources/        # expect 31M
```

- [ ] **Step 4 (Option A only): Note it in the README**

Under `## Layout`, the `sources/<slug>/` line already reads "kept out of the site (and out of git)" from Task 3. Add below the layout block:

```markdown
`sources/` holds the untouched originals — the scanned postcards and the raw
Street View captures each pair was built from. It is gitignored: these are
working files, not site files, and they are three times the size of everything
that actually ships. **Back them up separately; git is not doing it for you.**
```

- [ ] **Step 5 (Option B only): STOP and hand back to the user**

Option B needs `git filter-repo` (not installed) and a force-push. Do not attempt it. Report to the user that Option B requires them to run it themselves, with these commands, after a full backup:

```bash
# BACK UP THE WHOLE DIRECTORY FIRST — this is not reversible.
brew install git-filter-repo
git filter-repo --path sources/ --invert-paths
git push --force origin main
```

- [ ] **Step 6: Run the checker**

```bash
node tools/check.mjs; echo "exit=$?"
```

Expected: `exit=0`. `check.mjs` never looks at `sources/`, so this only confirms nothing else moved.

- [ ] **Step 7: Commit**

```bash
git add .gitignore README.md
git commit -m "chore: stop tracking sources/, the unshipped working originals"
```

---

## Task 9: Loading polish

Small, independent wins. Do these last; none of them is worth risking an earlier task over.

**Files:**
- Modify: `index.html`, `tools/templates.mjs` (font preloads, `defer`)
- Modify: `assets/slider.js`, `assets/series.js` (shared boot)

**Interfaces:**
- Consumes: nothing new.
- Produces: both scripts load with `defer`; the `readyState` guard is deleted from both.

- [ ] **Step 1: Preload both font files**

The masthead uses Cormorant Garamond with `font-display:swap`, so it visibly reflows. Add to `<head>` in `index.html`, immediately after the stylesheet link:

```html
<link rel="preload" href="assets/cormorant-garamond.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/lora.woff2" as="font" type="font/woff2" crossorigin>
```

And the same in `pairPage()` in `tools/templates.mjs`, with `../` prefixes:

```html
<link rel="preload" href="../assets/cormorant-garamond.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="../assets/lora.woff2" as="font" type="font/woff2" crossorigin>
```

`crossorigin` is required even for same-origin fonts — without it the preload is discarded and the font is fetched twice. Verify in Step 4.

- [ ] **Step 2: Add `defer` to every script tag**

In `index.html`:

```html
<script src="data/pairs.js" defer></script>
<script src="assets/series.js" defer></script>
```

In `pairPage()` in `tools/templates.mjs`:

```html
<script src="../data/pairs.js" defer></script>
<script src="../assets/slider.js" defer></script>
<script src="../assets/series.js" defer></script>
```

`defer` preserves execution order, so `pairs.js` still runs before `series.js`.

- [ ] **Step 3: Delete the now-redundant boot guards**

With `defer`, both scripts run after parsing, so the `readyState` dance is dead weight. In **both** `assets/slider.js` and `assets/series.js`, replace the closing block:

```js
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
```

with:

```js
  // Both scripts load with defer, so the document is parsed by the time this
  // runs — see the <script> tags in the page template.
  boot();
})();
```

- [ ] **Step 4: Rebuild and verify the fonts preload cleanly**

```bash
node tools/build.mjs
node tools/check.mjs; echo "exit=$?"
python3 -m http.server 8000 &
```

Open `http://localhost:8000/` with DevTools → Console and Network, hard-reload. Confirm:

- **No console warning** of the form "was preloaded using link preload but not used within a few seconds" — that warning means `crossorigin` is missing or the `as` value is wrong.
- Each `.woff2` is fetched **once**, not twice.
- The masthead does not visibly re-flow from a fallback serif to Cormorant.
- The ledger and the slider both still work — this is the step where a botched `defer` shows up as a dead page.

Open a pair page and confirm the slider, all three modes, expand, prev/next and the Where row all work. Then `kill %1`.

- [ ] **Step 5: Confirm `file://` still works**

```bash
open index.html
```

`defer` behaves identically on `file://`. Click into a pair page and exercise the slider.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "perf: preload the two font faces and defer all scripts"
```

---

## Task 10: Document the new authoring flow

Whoever adds pair fourteen — including a future model — needs this. Without it the build is a trap.

**Files:**
- Create: `docs/BUILD.md`

- [ ] **Step 1: Write `docs/BUILD.md`**

````markdown
# Adding a pair

`pairs/*.html` and the ledger in `index.html` are **generated**. Do not hand-edit
them; the next `node tools/build.mjs` will overwrite your changes. Everything a
page says lives in `data/pairs.js`.

## 1. Put the images in place

```
images/<slug>/then.jpg          the aligned historical plate
images/<slug>/now.jpg           the aligned modern plate, identical dimensions
images/<slug>/thumb-then.jpg    640×397
images/<slug>/thumb-now.jpg     640×397
sources/<slug>/                 the untouched originals (gitignored)
```

`then.jpg` and `now.jpg` must be exactly the same pixel dimensions — the whole
comparison depends on it, and `tools/check.mjs` will fail if they are not. The
ratio does not have to be 2048×1271; that is just what most pairs happen to be.
See [THEN-NOW-PLAYBOOK.md](THEN-NOW-PLAYBOOK.md) for how to do the alignment.

## 2. Add the entry to `data/pairs.js`

Append to the `pairs` array. Position in the array sets both the ledger order and
the prev/next order.

```json
{
  "slug": "example-corner",
  "title": "The Example Building",
  "shortTitle": "Example Building",
  "pageTitle": "The Example Building",
  "description": "One sentence for search results and link previews.",
  "heading": "The&nbsp;Example<br>Building",
  "location": "Spruce Street at Wyoming Avenue",
  "coords": [41.40882, -75.66530],
  "streetview": "https://www.google.com/maps/@...",
  "compareLabel": "Compare 1912 with today. Drag, or use the arrow keys.",
  "plate": { "width": 2048, "height": 1271 },
  "blurb": "One or two sentences for the index row.",
  "standfirst": "The paragraph in the sidecar. Entities are fine: &mdash; &eacute;",
  "then": {
    "year": "1912",
    "alt": "Describe what a sighted reader sees in the historical plate.",
    "credit": "Postcard, publisher unknown. Lackawanna Historical Society."
  },
  "now": {
    "year": "Today",
    "alt": "Describe the same view today.",
    "credit": "Google Street View. Imagery &copy;&nbsp;Google."
  },
  "fit": "A note on how the two frames were aligned, and what had to be compromised."
}
```

**Required:** `slug`, `title`, `shortTitle`, `pageTitle`, `description`, `heading`,
`location`, `compareLabel`, `plate`, `blurb`, `standfirst`, and `year`, `alt` and
`credit` on both `then` and `now`.

**Optional:** `coords` and `streetview` (together they add the "Where" row to the
credits table — three pairs have neither), and `fit` (omit it and the page shows
two credit rows instead of three, as `high-school` does).

### Field notes

- `pageTitle` is the `<title>`, rendered as `<pageTitle> — Then & Now`. It is
  separate from `title` because they genuinely differ: `title` is
  "The Lackawanna Avenue Bridge", `pageTitle` is "Lackawanna Avenue Bridge".
- `heading` and `standfirst` and the `credit` fields are **raw HTML**. Entities
  and `<br>` are inserted as written. That is deliberate — it is how the
  typography survives — and it means these fields must be hand-authored. Never
  paste text from an untrusted source into them.
- `alt`, `description` and `compareLabel` are escaped at build time. Write them
  as plain text; do not add entities by hand.
- `plate.width` / `plate.height` must match the actual pixel dimensions of
  `then.jpg` and `now.jpg`. They set the `aspect-ratio` and reserve layout space,
  so a wrong value causes a visible jump on load.

## 3. Build, and check

```sh
node tools/images.mjs    # responsive variants — minutes; only after new images
node tools/build.mjs      # regenerate the pages and the ledger — instant
node tools/check.mjs      # verify everything resolves
```

`tools/check.mjs` must exit 0 before you commit. It verifies that every manifest
entry has a page and every page has an entry, that all four images and every
responsive variant exist, that every `src`, `href` and `srcset` in every page
resolves on disk, that nothing under `images/` is unreferenced, that no CSS
selector is dead, and that the index ships a static link to every pair.

## 4. Look at it

```sh
python3 -m http.server 8000
```

Check the new page and the index. Then open `index.html` straight from disk and
check it again — the site must work from `file://` with no server, which is why
the manifest is a `<script>`-assigned global rather than fetched JSON.

## What lives where

| File | Role |
|---|---|
| `data/pairs.js` | Every word on every page. The only file you edit by hand. |
| `tools/manifest.mjs` | Reads and writes `data/pairs.js`. Knows its one quirk. |
| `tools/templates.mjs` | Manifest entry → HTML. Change the page *shape* here. |
| `tools/build.mjs` | Writes the 13 pages and injects the ledger. |
| `tools/check.mjs` | The test suite. |
| `tools/images.mjs` | Generates AVIF/WebP/JPEG variants. |
````

- [ ] **Step 2: Follow your own instructions end to end**

The only way to know the doc is right is to use it. Add a throwaway pair, build, verify, then remove it.

```bash
cp -R images/albright images/test-pair
node --input-type=module -e '
import { readManifest, writeManifest } from "./tools/manifest.mjs";
const m = readManifest(process.cwd());
const base = JSON.parse(JSON.stringify(m.pairs.find(p => p.slug === "albright")));
Object.assign(base, {
  slug: "test-pair", title: "Test Pair", shortTitle: "Test Pair",
  pageTitle: "Test Pair", description: "A throwaway pair for verifying the build.",
  heading: "Test<br>Pair", blurb: "Throwaway."
});
delete base.fit;
m.pairs.push(base);
writeManifest(process.cwd(), m);
'
node tools/images.mjs
node tools/build.mjs
node tools/check.mjs; echo "exit=$? (expect 0)"
```

Expected: `built 14 pair pages`, `injected the index ledger`, and `check: ok — 14 pairs, 15 pages`, exit 0.

Also confirm the optional fields behave as documented:

```bash
grep -c '<th scope="row">' pairs/test-pair.html   # expect 2 — no `fit` was set
grep -c 'row__where' pairs/test-pair.html          # expect 0 in the page body
```

If `check.mjs` fails, or the counts are wrong, `docs/BUILD.md` is lying about
something. Fix the doc (or the template), then re-run.

- [ ] **Step 3: Remove the throwaway pair**

```bash
rm -rf images/test-pair pairs/test-pair.html
node --input-type=module -e '
import { readManifest, writeManifest } from "./tools/manifest.mjs";
const m = readManifest(process.cwd());
m.pairs = m.pairs.filter(p => p.slug !== "test-pair");
writeManifest(process.cwd(), m);
'
node tools/build.mjs
node tools/check.mjs; echo "exit=$?"
git status --short
```

Expected: `check: ok — 13 pairs, 14 pages`, exit 0, and `git status` shows no
trace of `test-pair` anywhere.

- [ ] **Step 4: Commit**

```bash
git add docs/BUILD.md
git commit -m "docs: document the manifest-driven authoring flow"
```

---

## Final verification

Run every check at once before proposing the merge. Do not skip any of these because an earlier task passed — the point is that they pass *together*, at the end.

- [ ] **Step 1: The checker is green**

```bash
node tools/check.mjs; echo "exit=$?"
```

Expected: `check: ok — 13 pairs, 14 pages`, exit 0.

- [ ] **Step 2: The build is idempotent**

Building twice must produce no diff. If it does, a template is non-deterministic.

```bash
node tools/build.mjs
git status --short
node tools/build.mjs
git status --short
```

Expected: identical (and clean) output both times.

- [ ] **Step 3: Every pair page still matches the Task 0 baseline semantically**

```bash
node --input-type=module -e '
import fs from "node:fs";
/* Strip the things Tasks 7 and 9 deliberately added, then compare the rest to
   the pre-refactor snapshot. Anything else that differs is a regression. */
const norm = (s) => s
  .replace(/<picture>[\s\S]*?<img /g, "<img ")
  .replace(/<\/picture>/g, "")
  .replace(/ srcset="[^"]*"/g, "")
  .replace(/ sizes="[^"]*"/g, "")
  .replace(/<link rel="preload"[^>]*>/g, "")
  .replace(/ defer>/g, ">")
  .replace(/ style="--plate:\d+\/\d+"/g, "")
  .replace(/&mdash;/g, "—")
  .replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
let bad = 0;
for (const f of fs.readdirSync("pairs").filter(f => f.endsWith(".html"))) {
  const a = norm(fs.readFileSync("/tmp/hs-baseline/pairs/" + f, "utf8"));
  const b = norm(fs.readFileSync("pairs/" + f, "utf8"));
  if (a === b) continue;
  bad++;
  console.log("DIFF " + f);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      console.log("  was: ..." + a.slice(Math.max(0, i - 60), i + 90));
      console.log("  now: ..." + b.slice(Math.max(0, i - 60), i + 90));
      break;
    }
  }
}
console.log(bad ? bad + " page(s) differ from baseline" : "all 13 pages match the baseline");
process.exit(bad ? 1 : 0);
'
```

Expected: `all 13 pages match the baseline`, exit 0.

- [ ] **Step 4: Manual pass over the four pages most likely to break**

```bash
python3 -m http.server 8000 &
```

| Page | Why it is the risky one | What to confirm |
|---|---|---|
| `/` | Static ledger replaced JS rendering | 13 rows, right order, hover reveals the historical thumb, gold chevron on hover |
| `/pairs/st-charles-hotel.html` | Portrait plate, 1547×2048 | Plate is portrait and uncropped, not letterboxed into a landscape box |
| `/pairs/high-school.html` | Only 2 credit rows, no coords | Two credit rows, **no** "Where" row, no JS errors in the console |
| `/pairs/spruce-street-trolley.html` | 1476px wide — no 1536/2048 variants exist | Plate loads, DevTools shows a 768 or 1024 variant, no 404s |

On each pair page exercise: drag the seam, arrow keys, Shift+arrow, all three modes, the expand button (twice — out and back), and prev/next.

Then `kill %1`.

- [ ] **Step 5: The console is clean on every page**

```bash
python3 -m http.server 8000 &
```

Visit `/` and all 13 pair pages with DevTools Console open. **Zero errors, zero warnings, zero 404s.** A 404 on a variant means Task 7's generation missed a pair. Then `kill %1`.

- [ ] **Step 6: The site still works with no server at all**

```bash
open index.html
```

Click into three different pairs from the ledger and exercise the slider on each. This is a hard constraint and the easiest one to break without noticing.

- [ ] **Step 7: Measure what the work bought**

```bash
echo "images/ on disk (incl. variants): $(du -sh images/ | cut -f1)"
echo "pair page source lines: $(cat pairs/*.html | wc -l)  (was 1264)"
echo "manifest lines: $(wc -l < data/pairs.js)"
echo "tools lines: $(cat tools/*.mjs | wc -l)"
```

Report these to the user alongside the summary. The honest framing: `pairs/*.html`
is now *generated*, so its line count is no longer maintenance burden — the number
that matters is manifest + tools, which is what a human actually edits.

- [ ] **Step 8: Review the whole diff before proposing a merge**

```bash
git log --oneline main..build-pipeline
git diff main..build-pipeline --stat
```

Read the diff for `assets/site.css`, `assets/series.js` and `assets/slider.js`
line by line. Those three are the files where a refactor mistake would be
invisible to every automated check above.

- [ ] **Step 9: Report to the user and stop**

Do not merge or push. Summarise: what changed, what the checker verifies, the
before/after numbers from Step 7, and anything you could not verify. If Task 8
Option B was chosen, restate that it is still outstanding and requires them.

---

## Notes for whoever executes this

**The constraint that matters most:** this is a refactor. If the rendered page
changes, you have a bug — even if the new version looks better. Design changes
are a separate conversation with the user.

**If a task's verification fails, do not proceed to the next task.** The tasks
build on each other; a broken template in Task 5 silently corrupts 13 pages in
every task after it.

**Two decisions were already made deliberately. Do not revisit them without
asking:**

1. *Manifest prose is raw, unescaped HTML.* Adding an escaping layer would
   mangle the existing typography (`&eacute;`, `&mdash;`, `&nbsp;`, `<br>`) on
   every page. It is safe here because there is exactly one author and no user
   input. It would not be safe in a site that accepts contributions.
2. *`tools/images.mjs` is not called by `tools/build.mjs`.* Encoding is slow and
   the pixels change far less often than the text. Coupling them would make
   every typo fix a multi-minute build.

**One thing this plan does not fix,** flagged during the audit and deliberately
left alone: the three non-standard-ratio pairs have 640×397 thumbnails, so the
index preview is a hard crop that does not match the page — most visibly on the
portrait `st-charles-hotel`. Making `--plate` vary per ledger row would fix it
but would break the ledger's uniform rhythm, which looks deliberate. **That is a
design call for the user, not a bug to fix mid-refactor.** Raise it in the
Step 9 report and let them decide.

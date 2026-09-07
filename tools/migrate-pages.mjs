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

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

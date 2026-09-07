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
<link rel="preload" href="../assets/cormorant-garamond.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="../assets/lora.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" type="image/avif"
      imagesrcset="${srcset(pair.slug, 'now', 'avif', pair.plate.width)}" imagesizes="${PLATE_SIZES}">
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

<script src="../data/pairs.js" defer></script>
<script src="../assets/slider.js" defer></script>
<script src="../assets/series.js" defer></script>
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
    const thumb = (half, extra) => `<picture>
            <source type="image/avif" srcset="images/${pair.slug}/thumb-${half}-320.avif 320w, images/${pair.slug}/thumb-${half}-640.avif 640w" sizes="(max-width: 860px) 100vw, 272px">
            <source type="image/webp" srcset="images/${pair.slug}/thumb-${half}-320.webp 320w, images/${pair.slug}/thumb-${half}-640.webp 640w" sizes="(max-width: 860px) 100vw, 272px">
            <img class="row__${half}" src="images/${pair.slug}/thumb-${half}.jpg" srcset="images/${pair.slug}/thumb-${half}-320.jpg 320w, images/${pair.slug}/thumb-${half}-640.jpg 640w" sizes="(max-width: 860px) 100vw, 272px" width="640" height="397" decoding="async"${lazy} ${extra}>
          </picture>`;
    const where = pair.location
      ? `\n        <p class="row__where">${ICON_PIN_ROW}${pair.location}</p>` : '';
    const blurb = pair.blurb
      ? `\n        <p class="row__blurb">${pair.blurb}</p>` : '';
    return `    <li>
      <a class="row" href="pairs/${pair.slug}.html">
        <span class="row__frame plate">
          ${thumb('now', `alt="${attr(pair.title)}, today"`)}
          ${thumb('then', 'alt="" aria-hidden="true"')}
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

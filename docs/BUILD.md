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

# Historical Scranton — Then & Now

Street scenes of Scranton, Pennsylvania, matched against the same view on Google
Street View and cut to the same frame, so you can slide between them.

A static site. No build step, no dependencies.

## Preview locally

Open `index.html`. That's it — no server, no build.

The manifest is loaded by a `<script>` tag rather than `fetch()` precisely so
this works from disk; `fetch` is subject to a cross-origin rule that blocks
`file://` reads, and `<script src>` isn't. Verified in Chrome from disk:
navigation, images, fonts and the slider all work.

If you'd rather preview the way GitHub Pages will actually serve it:

```sh
python3 -m http.server   # then http://localhost:8000
```

## Layout

```
index.html              the grid of every pair
pairs/<slug>.html       one page per location — markup only
assets/
  site.css              design tokens and every style in the series
  slider.js             the comparison widget
  series.js             reads the manifest, builds the grid and prev/next
  fonts/                Bodoni Moda and Inter, latin subset
images/<slug>/
  then.jpg  now.jpg     the aligned plates, 2048×1271
  thumb-then.jpg  thumb-now.jpg    640×397, for the index cards
sources/<slug>/         originals, kept out of the site
data/pairs.js           the manifest
docs/                   notes on making these
```

Every pair is cut to **2048×1271**. Keeping one ratio across the series is what
lets a single `--plate` token drive both the cards and the stages.

### Why `sources/` exists

The served JPEGs are compressed and, where the Street View crop had to be
upscaled, sharpened. You cannot re-cut a better version from those. `sources/`
keeps the untouched postcard scan and the raw screenshot so a pair can always be
re-aligned later.

## Adding a pair

1. **Align the modern shot** to the historical image's exact pixel dimensions.
   `docs/THEN-NOW-PLAYBOOK.md` has the prompt and the notes on capturing a
   Street View frame worth aligning.

2. **Drop the files in.**

   ```sh
   SLUG=lackawanna-ave
   mkdir -p images/$SLUG sources/$SLUG
   cp postcard.jpg  sources/$SLUG/postcard-original.jpg
   cp raw-shot.png  sources/$SLUG/streetview-aligned.png

   magick sources/$SLUG/postcard-original.jpg -quality 86 -strip images/$SLUG/then.jpg
   magick sources/$SLUG/streetview-aligned.png -quality 86 -strip images/$SLUG/now.jpg

   for half in then now; do
     magick images/$SLUG/$half.jpg -resize 640x397^ -gravity center \
       -extent 640x397 -quality 82 -strip images/$SLUG/thumb-$half.jpg
   done
   ```

   Add `-unsharp 0x1.0+0.7+0.02` to the `now.jpg` line if the Street View crop
   was upscaled and reads soft next to the postcard.

3. **Copy a page.** `cp pairs/high-school.html pairs/$SLUG.html`, then edit the
   `<title>`, the `data-pair` slug on `<body>`, the headline, the standfirst,
   the two year labels, the four image paths, the alt text, and the credits.

4. **Add one manifest entry** to `data/pairs.js`. It's a plain JSON body behind
   one assignment — edit it exactly as you would a `.json` file. Array order sets
   both the grid order and the prev/next order.

   ```json
   {
     "slug": "lackawanna-ave",
     "title": "Lackawanna Avenue, Scranton, Pa.",
     "shortTitle": "Lackawanna Avenue",
     "location": "Lackawanna Avenue at Wyoming",
     "neighborhood": "Central City",
     "then": { "year": "c. 1905", "sort": 1905 },
     "now":  { "year": "Today",   "sort": null },
     "blurb": "One sentence on what survived and what didn't."
   }
   ```

Nothing else needs touching. The index picks the pair up, and its neighbours get
prev/next links pointing at it.

`neighborhood` and the numeric `sort` years aren't read by anything yet. They're
recorded from the start so that grouping or filtering the grid, once the series
is long enough to need it, is a UI change rather than a data migration.

## Rights

Pre-1930 postcards are generally public domain, but check each one before
publishing. Google Street View imagery is not: Google's terms allow display with
attribution intact, so every pair page credits it and the watermark stays in the
frame.

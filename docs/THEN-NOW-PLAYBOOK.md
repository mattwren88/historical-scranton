# Then / Now slider — starter prompt

## The prompt to paste

> I'm building a "then and now" series for Scranton. I have two images:
>
> 1. A historical photo/postcard: **[what it shows, cross streets, approximate year]**
> 2. A modern Google Street View screenshot of the same spot
>
> Do two things:
>
> **Step 1 — align.** Crop and scale the Street View screenshot so it matches the
> historical image's framing as closely as possible. Output it at the exact pixel
> dimensions of the historical image. Work from fixed landmarks that survive in both
> shots — building corners, cornice lines, spires, curb lines, the point where the
> street recedes. Pick two of them, tell me which two you used, and confirm they land
> within a few percent of each other. Don't warp perspective unless a straight crop
> genuinely can't get there; say so if it can't.
>
> Before you finalize, check that nothing important is clipped at the frame edges —
> especially anything tall near the top.
>
> **Step 2 — build the slider.** Self-contained HTML file, images embedded as base64,
> no external assets. Drag anywhere on the image, arrow keys scrub, responsive down to
> mobile. Label the two halves with the years. Use this design system so all the pages
> in the series match:
>
> ```
> --ink:  #1c2320   (page background)
> --card: #f3efe4   (text, handle)
> --rule: #cbc3af
> --teal: #3f7d78   (focus state)
> --clay: #a8503c
> --muted:#6d6a5e
> Display: Bodoni Moda · Body: Inter
> ```
>
> Name the file `[location-slug]-then-now.html`.

---

## Notes for capturing the modern half

**Get the Street View position right before you screenshot.** The alignment is only as
good as where the camera stood. Open Street View, then walk the pegman up and down the
block until the *depth relationship* matches — does the building look as far away in
your screenshot as it does in the postcard? That matters more than the heading, which
is easy to fix later with a crop.

**Zoom in before screenshotting.** Street View's default field of view is much wider
than most old postcards, which were shot on longer lenses. If you screenshot wide and
let the crop do the zooming, you're upscaling a small region and it goes soft — that's
what happened with the Adams Ave one (a 868px crop stretched to 2048). Zoom in Street
View first so the crop is closer to 1:1.

**Check "See more dates."** Older Street View captures sometimes have better light,
fewer parked cars, or bare trees that reveal a façade the summer capture hides.

**Match the season if you can.** Leaf-on vs leaf-off changes how much of the building
you see, and it's the single biggest reason a pair reads as "different place" rather
than "same place, different century."

## Sources for the historical half

- Library of Congress Prints & Photographs — public domain, high resolution
- Lackawanna Historical Society
- Albright Memorial Library's local history collection
- Penn State's Pennsylvania postcard digitizations
- eBay postcard listings often have the best scans of NEPA street scenes

Check rights before you publish. Pre-1930 postcards are generally public domain;
Google Street View imagery is not — Google's terms allow display with attribution
intact, so keep the "© Google" watermark visible or credit it in the page.

## If you want to scale the series

Once you've done three or four by hand, the repeated part is the crop math, not the
judgment. Worth building: a small script that takes the historical image, the raw
screenshot, and four corresponding point pairs you click, then spits out the aligned
crop and the HTML. The point-picking stays manual — that's the part that needs eyes.

---

## Built so far

| Slug | Page | Then | Now | Fit |
|---|---|---|---|---|
| `terrace-hotel` | `pairs/terrace-hotel.html` | c. 1900 photograph | Street View | subject demolished; straight crop to the surviving wall |
| `albright` | `pairs/albright.html` | c. 1900 photograph | Street View | straight crop; building essentially unaltered |
| `courthouse-square` | `pairs/courthouse-square.html` | c. 1905 photograph | Street View | straight crop, anchored on the memorial column |
| `hotel-jermyn` | `pairs/hotel-jermyn.html` | 1950s postcard | Street View | straight crop; camera happened to land in the right spot |
| `high-school` | `pairs/high-school.html` | 1910 postcard | Street View | straight crop; spire and roof peak within ~1.5% |
| `providence-auditorium` | `pairs/providence-auditorium.html` | c. 1910 postcard | Street View | **perspective-corrected**; four building corners match |
| `scranton-dry-goods` | `pairs/scranton-dry-goods.html` | 1920s glass plate | Street View | **perspective-corrected**; six points agree within 2% |
| `wyoming-ave` | `pairs/wyoming-ave.html` | mid-century linen card | Street View | straight crop; churches match, background tower ~3% off |

**A full perspective correction is often too much.** `scranton-dry-goods`
shipped with a homography that matched six points to within 2% — and looked
wrong, because it sheared everything that was not the fitted building. The plate
had been shot with a view camera holding its verticals parallel; Street View
converges. Forcing one onto the other skews the surroundings.

The fix is to use a *fraction* of the correction. Fit both a similarity (scale
and translate only) and the full homography, then blend the two destination sets
by a factor k and solve for the transform in between:

```
dest(k) = (1-k) * similarity(p) + k * homography(p)
```

| k | worst residual | look |
|---|---|---|
| 0.0 | 5.5% of width | undistorted, loosest fit |
| 0.5 | ~3.5% | undistorted — **shipped** |
| 0.7 | 2.9% | stretching becomes visible |
| 1.0 | 2.0% | clearly distorted |

Registration and believability pull in opposite directions here, and the eye
notices distortion long before it notices a 3% misfit. Render the candidates side
by side at the same crop and choose by looking, not by the residual.

**When a straight crop can't get there.** Two of these pairs hit the limit, and
they need opposite responses.

`providence-auditorium` is a corner view: the postcard was shot from across the
street on a longer lens, the Street View frame is a close wide-angle browser
capture, so the facade converges much harder. A crop cannot change convergence.
Because the subject is a single building with four readable corners, a four-point
perspective transform fixes it cleanly:

```sh
magick streetview.png -virtual-pixel background -background '#12181a' \
  -set option:distort:viewport 2048x1271+0+0 \
  -distort Perspective 'sx1,sy1 dx1,dy1  sx2,sy2 dx2,dy2 \
                        sx3,sy3 dx3,dy3  sx4,sy4 dx4,dy4' out.png
```

Pick the four points as the building's outer box — corner top, corner bottom,
far end top, far end bottom — and read them off a labelled grid overlay of each
image. Validate on a fifth feature you did *not* fit. On a re-clad building
expect that check to be weak: the surfaces moved even though the structure
didn't.

**Condition the points, or the fit explodes.** `scranton-dry-goods` showed how
badly this can go. Two attempts failed before the third worked:

| points used | result |
|---|---|
| corner top/bottom + *both* wing tops | 3 of 4 points along the top edge — badly conditioned, black voids in the frame |
| corner top/bottom + left wing top/bottom (exact 4-point fit) | left wing perfect, right wing **15% of frame width** out — the fit was extrapolating past its own points |
| all six points, least squares | every point within **2%** — the one that shipped |

The lesson: four points that only span *part* of the subject will fit those four
exactly and then extrapolate wildly across the rest. Spread the points over the
whole subject and let least squares distribute the error. `magick` only takes
four pairs, so solve the homography over all your points first, then feed it four
source points and their *fitted* destinations — the same transform, in a form
`-distort Perspective` accepts.

A corner view has two facade planes, so no single homography is exact for both.
Whether that matters is an empirical question, not a theoretical one — here the
six-point fit landed inside 2% and the theory's objection turned out not to bite.

**`wyoming-ave` wants a re-shoot instead.** The Street View frame was captured from
further north than the postcard vantage, so the two views have different
parallax, not just different zoom. Three points along the same sightline (left
church, background tower, right church corner) give inconsistent scale factors —
1.15, 1.20 and 0.72 — and a crop cannot change the ratio of distances between
collinear points. Walk the pegman south along Wyoming Avenue until the background
tower closes up against the right-hand church the way it does on the card, then
zoom in before screenshotting. A perspective transform will not save this one:
the frame holds several buildings at different depths, and a single homography
can only straighten one plane.

**When the subject is gone.** `terrace-hotel` burned in 1986 and the site was
cleared, so there is no building to fit. What survives is a stone retaining wall
across the street and the shape of the intersection — and both sit in the
right-hand third of the frame.

That makes a perspective warp the *wrong* tool, for the same reason it was the
right one on `providence-auditorium`: a homography fitted to landmarks clustered
in one part of the frame extrapolates across the rest, and here the rest is the
two thirds where the subject used to stand — precisely the region a viewer
studies. A straight crop can be approximately right everywhere. An
ill-conditioned warp is exactly right in one corner and arbitrarily wrong in the
part you care about.

So: scale off whatever survives (here, the height of the wall's stone face,
measured as a fraction of frame height in both), place it, and sweep crop
parameters against a blend until the landmark sits still. Say on the page that
the registration is approximate. A demolished subject is worth publishing — the
absence is the story — but do not dress an estimate up as a measurement.

**Street View UI.** A full browser screenshot carries the search box, the address
panel, the compass and the attribution bar. Cropping to align usually throws them
outside the frame; where it doesn't, patch them before finalising — the panel on
`providence-auditorium` sat wholly on sky, so a 20px column of clean sky stretched
across the area removed it without a trace. Leave the `© Google` watermark alone.

Originals for each pair live in `sources/<slug>/`. See the repo README for the
steps to add a new one.

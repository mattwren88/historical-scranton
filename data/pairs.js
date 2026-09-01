/* The manifest for the whole series: the grid order, the prev/next order, and
   every card's text all come from here.

   This is a .js file rather than .json on purpose. A <script> tag is not subject
   to the cross-origin rule that blocks fetch() on file:// URLs, so the site works
   when you open index.html straight off disk — no local server needed. The body
   below is plain JSON; edit it exactly as you would a .json file. */

window.SCRANTON_PAIRS = {
  "pairs": [
    {
      "slug": "terrace-hotel",
      "title": "The Hotel Terrace",
      "shortTitle": "Hotel Terrace",
      "location": "Wyoming Avenue at Vine Street",
      "neighborhood": "Central City",
      "then": { "year": "c. 1900", "sort": 1900 },
      "now":  { "year": "Today",   "sort": null },
      "blurb": "Burned in 1986 and cleared. The stone wall across the street is the only thing left to line up."
    },
    {
      "slug": "high-school",
      "title": "High School, Scranton, Pa.",
      "shortTitle": "High School",
      "location": "Vine Street at Adams Avenue",
      "neighborhood": "Central City",
      "then": { "year": "1910",  "sort": 1910 },
      "now":  { "year": "Today", "sort": null },
      "blurb": "The tower and the roofline hold their positions; the elms over the sidewalk do not."
    },
    {
      "slug": "providence-auditorium",
      "title": "The Auditorium, Providence, Pa.",
      "shortTitle": "The Auditorium",
      "location": "North Main Avenue at Oak Street",
      "neighborhood": "Providence",
      "then": { "year": "c. 1910", "sort": 1910 },
      "now":  { "year": "Today",   "sort": null },
      "blurb": "The shape survived the century. The surface did not."
    },
    {
      "slug": "scranton-dry-goods",
      "title": "Scranton Dry Goods Co.",
      "shortTitle": "Scranton Dry Goods",
      "location": "Lackawanna Avenue at Wyoming Avenue",
      "neighborhood": "Central City",
      "then": { "year": "1920s", "sort": 1925 },
      "now":  { "year": "Today", "sort": null },
      "blurb": "The signs called it Scranton's Busiest Corner. The building is still standing; the signs are not."
    },
    {
      "slug": "wyoming-ave",
      "title": "Wyoming Avenue Looking South",
      "shortTitle": "Wyoming Avenue",
      "location": "Wyoming Avenue, looking south",
      "neighborhood": "Central City",
      "then": { "year": "Mid-century", "sort": 1945 },
      "now":  { "year": "Today",       "sort": null },
      "blurb": "Two churches bookend the block and both still stand. Most of what filled the gap is now a parking lot."
    }
  ]
};

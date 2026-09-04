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
      "coords": [41.41234920167138, -75.66090212768962],
      "streetview": "https://www.google.com/maps/@41.4122911,-75.6612226,3a,75y,99.71h,100.65t/data=!3m8!1e1!3m6!1sBLRcRjYnri-ldEgwsojXOw!2e0!5s20221101T000000!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-10.645355702515772%26panoid%3DBLRcRjYnri-ldEgwsojXOw%26yaw%3D99.71338750089717!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      "title": "The Hotel Terrace",
      "shortTitle": "Hotel Terrace",
      "location": "Wyoming Avenue at Vine Street",
      "neighborhood": "Central City",
      "then": { "year": "c. 1900", "sort": 1900 },
      "now":  { "year": "Today",   "sort": null },
      "blurb": "Burned in 1986 and cleared. The stone wall across the street is the only thing left to line up."
    },
    {
      "slug": "albright",
      "title": "Albright Memorial Library",
      "shortTitle": "Albright Library",
      "location": "Vine Street at North Washington Avenue",
      "neighborhood": "Central City",
      "coords": [41.41103948995529, -75.6596056608472],
      "streetview": "https://www.google.com/maps/@41.4114909,-75.6597765,3a,41.2y,171.52h,98.57t/data=!3m7!1e1!3m5!1s2MTNSmlC8l9FOzcD9mgFMQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-8.574443778775318%26panoid%3D2MTNSmlC8l9FOzcD9mgFMQ%26yaw%3D171.52434159577936!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      "then": { "year": "c. 1900", "sort": 1901 },
      "now":  { "year": "Today",   "sort": null },
      "blurb": "Modelled on the Cluny in Paris. A century on, what has changed is mostly the signage."
    },
    {
      "slug": "courthouse-square",
      "title": "Courthouse Square",
      "shortTitle": "Courthouse Square",
      "location": "Spruce Street at North Washington Avenue",
      "neighborhood": "Central City",
      "coords": [41.40806891348196, -75.66341906263511],
      "streetview": "https://www.google.com/maps/@41.4078612,-75.6638135,3a,41.2y,72.53h,91.42t/data=!3m8!1e1!3m6!1szbribdtVa4ejFz-sv6oe4A!2e0!5s20260601T000000!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-1.4186702345729998%26panoid%3DzbribdtVa4ejFz-sv6oe4A%26yaw%3D72.52552591271353!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      "then": { "year": "c. 1905", "sort": 1905 },
      "now":  { "year": "Today",   "sort": null },
      "blurb": "The memorial column was new when this was taken. It is still the only thing in the frame that has not moved."
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
      "coords": [41.40763243785716, -75.66613546034903],
      "streetview": "https://www.google.com/maps/@41.4076542,-75.6665024,3a,75y,94.92h,100.32t/data=!3m7!1e1!3m5!1s4PxTuOIkgQn3g0qnMuEpaQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-10.323411543128728%26panoid%3D4PxTuOIkgQn3g0qnMuEpaQ%26yaw%3D94.917884167368!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
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
    },
    {
      "slug": "hotel-jermyn",
      "title": "The Hotel Jermyn",
      "shortTitle": "Hotel Jermyn",
      "location": "Spruce Street at Wyoming Avenue",
      "neighborhood": "Central City",
      "coords": [41.408822236174174, -75.66530236759533],
      "streetview": "https://www.google.com/maps/@41.4088662,-75.6649772,3a,60y,268.74h,106.15t/data=!3m7!1e1!3m5!1siZEKiPwmdFgTkuzgW_VSag!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-16.14507900540474%26panoid%3DiZEKiPwmdFgTkuzgW_VSag%26yaw%3D268.73656627032386!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      "then": { "year": "1950s", "sort": 1955 },
      "now":  { "year": "Today", "sort": null },
      "blurb": "Radler's and the Purple Cow are lettered across the ground floor. Both were gone by 1965; the building wasn't."
    },
    {
      "slug": "dickson-manufacturing",
      "title": "Dickson Manufacturing Co.",
      "shortTitle": "Dickson Works",
      "location": "Penn Avenue at Vine Street",
      "neighborhood": "Central City",
      "coords": [41.41303906200862, -75.66203107680582],
      "streetview": "https://www.google.com/maps/@41.4127004,-75.6617426,3a,38.5y,340.95h,94.48t/data=!3m7!1e1!3m5!1skWqmUTpGLohCwbgsrUoNcg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-4.483780200034431%26panoid%3DkWqmUTpGLohCwbgsrUoNcg%26yaw%3D340.9470089472848!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",
      "then": { "year": "c. 1895", "sort": 1895 },
      "now":  { "year": "Today",   "sort": null },
      "blurb": "The works turned out a hundred locomotives a year. The tower still stands, shorn of its spire, over a paper warehouse."
    }
  ]
};

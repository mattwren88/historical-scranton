/* The manifest for the whole series: the grid order, the prev/next order, and
   every card's text all come from here.

   This is a .js file rather than .json on purpose. A <script> tag is not subject
   to the cross-origin rule that blocks fetch() on file:// URLs, so the site works
   when you open index.html straight off disk — no local server needed. The body
   below is plain JSON; edit it exactly as you would a .json file.

   pairs/*.html is GENERATED from this file by tools/build.mjs. Edit here, then
   run: node tools/build.mjs */

window.SCRANTON_PAIRS = {
  "pairs": [
    {
      "slug": "terrace-hotel",
      "coords": [
        41.41234920167138,
        -75.66090212768962
      ],
      "streetview": "https://www.google.com/maps/@41.4122911,-75.6612226,3a,75y,99.71h,100.65t/data=!3m8!1e1!3m6!1sBLRcRjYnri-ldEgwsojXOw!2e0!5s20221101T000000!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-10.645355702515772%26panoid%3DBLRcRjYnri-ldEgwsojXOw%26yaw%3D99.71338750089717!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      "title": "The Hotel Terrace",
      "shortTitle": "Hotel Terrace",
      "location": "Wyoming Avenue at Vine Street",
      "then": {
        "year": "c. 1900",
        "alt": "A winter photograph of the Hotel Terrace: a four-storey shingled hotel with dormers along its roof and a conical corner turret lettered TERRACE, standing above a stone terrace wall on the corner.",
        "credit": "Photograph, Hotel Terrace, Wyoming Avenue at Vine Street. Dated from the hotel&rsquo;s original name, which it lost in the 1920s. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The corner today: the hotel site is a flat parking lot behind barricades, with a traffic signal at the crossing and the stone retaining wall still holding the raised ground on the right.",
        "credit": "Google Street View, captured November&nbsp;2022 &mdash; an older capture, chosen because its bare trees match the winter in the photograph. Imagery &copy;&nbsp;Google."
      },
      "blurb": "Burned in 1986 and cleared. The stone wall across the street is the only thing left to line up.",
      "pageTitle": "The Hotel Terrace",
      "description": "The Hotel Terrace at Wyoming Avenue and Vine Street, Scranton, photographed around 1900 and set against the cleared site on Google Street View today.",
      "heading": "The&nbsp;Hotel<br>Terrace",
      "compareLabel": "Compare around 1900 with today. Drag, or use the arrow keys.",
      "standfirst": "Opened in 1894 by William Henry Whyte, it became the Hotel Vine, then the Hotel Corine, and by the 1940s the Hotel Scranton, whose cheap rooms housed people with nowhere else to go. Fire took it in 1986 and the site was cleared. The stone wall across the street is still standing.",
      "plate": {
        "width": 2048,
        "height": 1271
      },
      "fit": "The hotel burned in 1986, so nothing in the foreground survives to align against. This pair is scaled and cropped to the stone wall across the street rather than corrected for perspective: every surviving landmark sits in the right-hand third, and a warp fitted to them would extrapolate badly across the two thirds where the hotel stood."
    },
    {
      "slug": "albright",
      "title": "Albright Memorial Library",
      "shortTitle": "Albright Library",
      "location": "Vine Street at North Washington Avenue",
      "coords": [
        41.41103948995529,
        -75.6596056608472
      ],
      "streetview": "https://www.google.com/maps/@41.4114909,-75.6597765,3a,41.2y,171.52h,98.57t/data=!3m7!1e1!3m5!1s2MTNSmlC8l9FOzcD9mgFMQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-8.574443778775318%26panoid%3D2MTNSmlC8l9FOzcD9mgFMQ%26yaw%3D171.52434159577936!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      "then": {
        "year": "c. 1900",
        "alt": "A winter photograph of the library around 1900: Gothic limestone gables, a corner tower and steep slate roof above an iron fence, with bare young trees on the snowy lawn.",
        "credit": "Photograph, &ldquo;Scranton Public Library &mdash; Albright Memorial Building.&rdquo; Undated; placed around 1900. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The library today: the same Gothic limestone front and slate roof behind its iron fence, with traffic signals and street signs across the corner.",
        "credit": "Google Street View. Imagery &copy;&nbsp;Google."
      },
      "blurb": "Modelled on the Cluny in Paris. A century on, what has changed is mostly the signage.",
      "pageTitle": "Albright Memorial Library",
      "description": "Scranton's Albright Memorial Library, photographed around 1900 and set against the same view on Google Street View today.",
      "heading": "Albright<br>Memorial&nbsp;Library",
      "compareLabel": "Compare around 1900 with today. Drag, or use the arrow keys.",
      "standfirst": "Opened in 1893 and modelled on the Mus&eacute;e de Cluny in Paris, the Albright was designed by the Buffalo firm Green &amp; Wicks. Its stained glass reproduces historic bookbinders&rsquo; marks, and stone owls and lions guard the door. A century on, what has changed is mostly the signage.",
      "plate": {
        "width": 2048,
        "height": 1271
      },
      "fit": "The building is essentially unaltered and both frames sit at almost the same distance, so this pair needed only a crop and a scale &mdash; no perspective correction."
    },
    {
      "slug": "courthouse-square",
      "title": "Courthouse Square",
      "shortTitle": "Courthouse Square",
      "location": "Spruce Street at North Washington Avenue",
      "coords": [
        41.40806891348196,
        -75.66341906263511
      ],
      "streetview": "https://www.google.com/maps/@41.4078612,-75.6638135,3a,41.2y,72.53h,91.42t/data=!3m8!1e1!3m6!1szbribdtVa4ejFz-sv6oe4A!2e0!5s20260601T000000!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-1.4186702345729998%26panoid%3DzbribdtVa4ejFz-sv6oe4A%26yaw%3D72.52552591271353!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      "then": {
        "year": "c. 1905",
        "alt": "A photograph of the Square around 1905: open trolley cars crossing in front of the memorial column, pedestrians in hats and long coats, the courthouse behind bare trees.",
        "credit": "Photograph, Spruce Street at North Washington Avenue, around 1905. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The Square today: the memorial column still on its plinth among bare trees, the courthouse and its clock tower to the right, parked cars along the kerb.",
        "credit": "Google Street View, captured November&nbsp;2022. Imagery &copy;&nbsp;Google."
      },
      "blurb": "The memorial column was new when this was taken. It is still the only thing in the frame that has not moved.",
      "pageTitle": "Courthouse Square",
      "description": "Courthouse Square in Scranton around 1905, set against the same view on Google Street View today.",
      "heading": "Courthouse<br>Square",
      "compareLabel": "Compare around 1905 with today. Drag, or use the arrow keys.",
      "standfirst": "Trolleys and pedestrians working their way around the Square. The Soldiers and Sailors Memorial, dedicated in 1900, was still new here, and the Board of Trade building across the Square had yet to carry the city&rsquo;s first illuminated sign. The column has not moved. Almost nothing else in the frame stayed put.",
      "plate": {
        "width": 2048,
        "height": 1271
      },
      "fit": "Anchored on the memorial column, the one thing standing in both frames. The historical scan is only 1071&nbsp;px wide and is enlarged about 1.9&times; here, so it reads softer than the rest of the series."
    },
    {
      "slug": "high-school",
      "title": "High School, Scranton, Pa.",
      "shortTitle": "High School",
      "location": "Vine Street at Adams Avenue",
      "then": {
        "year": "1910",
        "alt": "A hand-coloured 1910 postcard of the same block: elms arch over a crowded sidewalk as a crowd streams toward the school entrance.",
        "credit": "Postcard, &ldquo;High School, Scranton, Pa.,&rdquo; 1910. Collection of the Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The same block today: the stone high school with its copper spire, seen past utility poles and parked cars.",
        "credit": "Google Street View. Imagery &copy;&nbsp;Google."
      },
      "blurb": "The tower and the roofline hold their positions; the elms over the sidewalk do not.",
      "pageTitle": "High School, Scranton, Pa.",
      "description": "A 1910 postcard of Scranton Central High School, aligned against the same view on Google Street View today.",
      "heading": "High&nbsp;School,<br>Scranton,&nbsp;Pa.",
      "compareLabel": "Compare 1910 with today. Drag, or use the arrow keys.",
      "standfirst": "Scranton Central High School opened in 1895 on a hill above downtown, on what was then a residential block &mdash; those are houses along Vine Street on the left. The tower and the roofline hold their positions. The canopy of trees does not, and the crowd walking under it has become a curb of parked cars.",
      "plate": {
        "width": 2048,
        "height": 1271
      }
    },
    {
      "slug": "providence-auditorium",
      "title": "The Auditorium, Providence, Pa.",
      "shortTitle": "The Auditorium",
      "location": "North Main Avenue at Oak Street",
      "then": {
        "year": "c. 1910",
        "alt": "A postcard of the Auditorium around 1910: a three-storey corner block with a heavy cornice topped by stone urns, a piano dealer at street level, and a horse and cart at the kerb.",
        "credit": "Postcard, &ldquo;The Auditorium, Providence, Pa.&rdquo; Publisher unknown; dated from the vehicles at the kerb. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The same corner today: the building re-clad in pale stucco and metal panel, its cornice removed, a car parked at the kerb.",
        "credit": "Google Street View, captured May&nbsp;2026. Imagery &copy;&nbsp;Google."
      },
      "blurb": "The shape survived the century. The surface did not.",
      "pageTitle": "The Auditorium, Providence, Pa.",
      "description": "A postcard of the Auditorium building on North Main Avenue in Providence, Scranton, set against the same corner on Google Street View today.",
      "heading": "The&nbsp;Auditorium,<br>Providence,&nbsp;Pa.",
      "compareLabel": "Compare around 1910 with today. Drag, or use the arrow keys.",
      "standfirst": "The building still holds its corner, three storeys on the same footprint. The cornice and its row of stone urns are gone, and the brick and terracotta have disappeared under stucco and metal panel. The shape survived. The surface did not.",
      "plate": {
        "width": 2048,
        "height": 1271
      },
      "fit": "The modern frame was shot closer and wider than the postcard, so this pair is corrected for perspective rather than simply cropped. The building&rsquo;s four corners match; the re-clad surfaces between them do not."
    },
    {
      "slug": "scranton-dry-goods",
      "coords": [
        41.40763243785716,
        -75.66613546034903
      ],
      "streetview": "https://www.google.com/maps/@41.4076542,-75.6665024,3a,75y,94.92h,100.32t/data=!3m7!1e1!3m5!1s4PxTuOIkgQn3g0qnMuEpaQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-10.323411543128728%26panoid%3D4PxTuOIkgQn3g0qnMuEpaQ%26yaw%3D94.917884167368!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      "title": "Scranton Dry Goods Co.",
      "shortTitle": "Scranton Dry Goods",
      "location": "Lackawanna Avenue at Wyoming Avenue",
      "then": {
        "year": "1920s",
        "alt": "A 1920s glass plate negative of the corner: a five-storey department store with SCRANTON DRY GOODS CO. lettered across the roofline, display windows below, streetcar tracks curving through the empty intersection.",
        "credit": "Glass plate negative, 1920s. Scranton Dry Goods Co., Lackawanna Avenue at Wyoming Avenue. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The same corner today: the department store building intact under a pale overcast sky, its roof signs gone, cars waiting at the crossing.",
        "credit": "Google Street View, captured May&nbsp;2026. Imagery &copy;&nbsp;Google."
      },
      "blurb": "The signs called it Scranton's Busiest Corner. The building is still standing; the signs are not.",
      "pageTitle": "Scranton Dry Goods Co.",
      "description": "A 1920s glass plate negative of Scranton Dry Goods at Lackawanna and Wyoming Avenues, set against the same corner on Google Street View today.",
      "heading": "Scranton<br>Dry&nbsp;Goods&nbsp;Co.",
      "compareLabel": "Compare the 1920s with today. Drag, or use the arrow keys.",
      "standfirst": "Signage over the display windows called this Scranton&rsquo;s Busiest Corner &mdash; Lackawanna at Wyoming, within a block of the department stores, theatres and restaurants. The building is still standing, cornice and all. The roof signs and the streetcar tracks are not.",
      "plate": {
        "width": 2048,
        "height": 1271
      },
      "fit": "The plate was shot from the sidewalk, further back than Street View can stand, so this pair carries a half-strength perspective correction. A full one lined the building up to within 2% of the frame but visibly stretched everything around it; this trades that back for about 3.5% and keeps the proportions honest."
    },
    {
      "slug": "wyoming-ave",
      "title": "Wyoming Avenue Looking South",
      "shortTitle": "Wyoming Avenue",
      "location": "Wyoming Avenue, looking south",
      "then": {
        "year": "Mid-century",
        "alt": "A linen postcard of the same block: shopfronts and theatre marquees line the street, with cars parked along both kerbs and a beacon on the tower closing the view.",
        "credit": "Linen postcard, &ldquo;Wyoming Avenue Looking South, Scranton, Pa.&rdquo; (no.&nbsp;46079), mid-century. Collection of the Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "Wyoming Avenue today: a red brick church on the right, a stone church tower at the far left, and surface parking along the block between them.",
        "credit": "Google Street View. Imagery &copy;&nbsp;Google."
      },
      "blurb": "Two churches bookend the block and both still stand. Most of what filled the gap is now a parking lot.",
      "pageTitle": "Wyoming Avenue Looking South",
      "description": "A mid-century linen postcard of Wyoming Avenue in Scranton, looking south, set against the same view on Google Street View today.",
      "heading": "Wyoming&nbsp;Avenue<br>Looking&nbsp;South",
      "compareLabel": "Compare the mid-century postcard with today. Drag, or use the arrow keys.",
      "standfirst": "Two churches bookend the block, and both are still standing. Between them the card counts off a shopping and theatre district — the State and Comerford marquees, an A&amp;P, Henry&rsquo;s 5 &amp; 10, the Savoy Restaurant, the Tip Toe Inn. Most of that stretch is a parking lot now.",
      "plate": {
        "width": 2048,
        "height": 1271
      },
      "fit": "The modern frame was shot from further back than the postcard, so the two churches line up but the background tower sits about 3% off. A closer Street View position would fix it."
    },
    {
      "slug": "hotel-jermyn",
      "title": "The Hotel Jermyn",
      "shortTitle": "Hotel Jermyn",
      "location": "Spruce Street at Wyoming Avenue",
      "coords": [
        41.408822236174174,
        -75.66530236759533
      ],
      "streetview": "https://www.google.com/maps/@41.4088662,-75.6649772,3a,60y,268.74h,106.15t/data=!3m7!1e1!3m5!1siZEKiPwmdFgTkuzgW_VSag!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-16.14507900540474%26panoid%3DiZEKiPwmdFgTkuzgW_VSag%26yaw%3D268.73656627032386!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      "then": {
        "year": "1950s",
        "alt": "A tinted 1950s postcard of the Hotel Jermyn: a six-storey corner block with arched windows, a vertical HOTEL JERMYN sign, and Radler's and the Purple Cow lettered across the shopfronts below.",
        "credit": "Postcard, Hotel Jermyn, Spruce Street at Wyoming Avenue, 1950s. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The same corner today: the Jermyn's brick and stone upper floors intact above plainer modern shopfronts, under traffic signals and street signs.",
        "credit": "Google Street View. Imagery &copy;&nbsp;Google."
      },
      "blurb": "Radler's and the Purple Cow are lettered across the ground floor. Both were gone by 1965; the building wasn't.",
      "pageTitle": "The Hotel Jermyn",
      "description": "A 1950s postcard of the Hotel Jermyn at Spruce Street and Wyoming Avenue, Scranton, set against the same corner on Google Street View today.",
      "heading": "The&nbsp;Hotel<br>Jermyn",
      "compareLabel": "Compare the 1950s with today. Drag, or use the arrow keys.",
      "standfirst": "By night, dinner and dancing in the Manhattan Club or the Omar Room; by day, lunch and shopping. Radler&rsquo;s dress shop and the Purple Cow sandwich counter are both lettered across the ground floor here, tucked either side of the Globe&rsquo;s men&rsquo;s shop. Radler&rsquo;s closed in 1963 and the Purple Cow moved out in 1965. The building stayed.",
      "plate": {
        "width": 2048,
        "height": 1271
      },
      "fit": "The Street View camera happened to stand almost where the postcard photographer did, so this pair needed only a crop and a scale."
    },
    {
      "slug": "dickson-manufacturing",
      "title": "Dickson Manufacturing Co.",
      "shortTitle": "Dickson Works",
      "location": "Penn Avenue at Vine Street",
      "coords": [
        41.41303906200862,
        -75.66203107680582
      ],
      "streetview": "https://www.google.com/maps/@41.4127004,-75.6617426,3a,38.5y,340.95h,94.48t/data=!3m7!1e1!3m5!1skWqmUTpGLohCwbgsrUoNcg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-4.483780200034431%26panoid%3DkWqmUTpGLohCwbgsrUoNcg%26yaw%3D340.9470089472848!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",
      "then": {
        "year": "c. 1895",
        "alt": "The Dickson works in the 1890s: a tall brick clock tower with a steep spire, roof balcony and weathervane rising over the shops, and a three-storey brick office block on the corner with awnings, a columned entrance porch and the company name lettered across its front, above a dirt street with wagons standing at the left.",
        "credit": "Photograph, the Dickson Manufacturing Company works, Penn Avenue at Vine Street. Undated; the company was absorbed by American Locomotive in 1901, which places it in the 1890s. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The site today: the same brick tower, its spire gone and a PENN PAPER sign across its face, standing over a long low shop building, with a modern one-storey warehouse and a parking lot filling the corner in front.",
        "credit": "Google Street View, captured May&nbsp;2026. Imagery &copy;&nbsp;Google."
      },
      "blurb": "The works turned out a hundred locomotives a year. The tower still stands, shorn of its spire, over a paper warehouse.",
      "pageTitle": "Dickson Manufacturing Co.",
      "description": "The Dickson Manufacturing Company works at Penn Avenue and Vine Street, Scranton, photographed in the 1890s and set against the surviving tower on Google Street View today.",
      "heading": "Dickson<br>Manufacturing&nbsp;Co.",
      "compareLabel": "Compare the 1890s with today. Drag, or use the arrow keys.",
      "standfirst": "Thomas Dickson&rsquo;s works started in 1856 with thirty men and a contract to build engines and boilers for the Delaware &amp; Hudson. By 1890 it employed more than 1,200 and turned out a hundred locomotives a year, alongside hoists and pumps for the mines, rolling-mill engines and waterworks machinery. American Locomotive absorbed the company in 1901. A Dickson engine was still working in Honduras in 1967.",
      "plate": {
        "width": 2048,
        "height": 1271
      },
      "fit": "The Street View frame is aligned to the photograph&rsquo;s own frame rather than scaled to fit it, and it registers closely: the PENN&nbsp;PAPER sign sits on the circle where the clock face was, and the arched windows, the corbelled band beneath them and the dormers all land together. The modern capture does not reach as high as the photograph does, so the top seven per cent of the &ldquo;now&rdquo; plate &mdash; sky, and nothing else &mdash; is reconstructed, and the four overhead wires that cross the join were measured below it and carried on as straight lines rather than left to stop in mid-air. Google&rsquo;s search box, address panel, minimap corner and place marker have been patched out of the sky, road and wall they sat on. No structure is invented. What differs between the two halves is real: the top of the tower &mdash; balcony, clock stage and spire &mdash; came down after the works closed, and the corner office block that fills the right of the photograph is gone, with a later warehouse and its parking lot on the ground it stood on."
    },
    {
      "slug": "lackawanna-ave-bridge",
      "title": "The Lackawanna Avenue Bridge",
      "shortTitle": "Lackawanna Avenue Bridge",
      "location": "Lackawanna Avenue at the river crossing",
      "coords": [
        41.41075177892645,
        -75.67136729335459
      ],
      "streetview": "https://www.google.com/maps/@41.4107163,-75.6713584,3a,42.9y,346.95h,89.4t/data=!3m8!1e1!3m6!1sXnyueuKyQJ79QvfvpYzMzQ!2e0!5s20201101T000000!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0.6047702408824307%26panoid%3DXnyueuKyQJ79QvfvpYzMzQ%26yaw%3D346.9517200199852!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",
      "then": {
        "year": "c. 1910",
        "alt": "The bridge in the early 1900s: men in flat caps and overcoats standing along a plank barrier on the left, trolley tracks running up the deck toward a streetcar in the middle distance, overhead wires strung from poles, an ornate cast-iron lamp standard and a diamond warning sign at the left edge, and men with bicycles at the right-hand rail. The station's turret rises above the roofs on the right.",
        "credit": "Photograph, the Lackawanna Avenue crossing looking toward the Central Railroad of New Jersey station. Undated; the station opened in 1893, and the electric cars and the dress put it in the early 1900s. Nothing narrower than that is supported. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The crossing today: a wide concrete deck with plain parapets and a row of modern lamp standards, a few cars coming the other way, and the brick station with its conical-roofed tower still standing at the right-hand end.",
        "credit": "Google Street View, captured November&nbsp;2020. Imagery &copy;&nbsp;Google."
      },
      "blurb": "The Central Railroad of New Jersey station still stands at the far end. The bridge under it has been rebuilt, and the trolleys went with it.",
      "pageTitle": "Lackawanna Avenue Bridge",
      "description": "The Lackawanna Avenue bridge in Scranton, photographed in the early 1900s with its trolley tracks, and set against the same crossing on Google Street View today with the Central Railroad of New Jersey station still standing at the far end.",
      "heading": "Lackawanna&nbsp;Avenue<br>Bridge",
      "compareLabel": "Compare the early 1900s with today. Drag, or use the arrow keys.",
      "standfirst": "Almost nothing about this photograph is recorded &mdash; not the day, not the crew standing on the deck, not what they had stopped for. The one thing in the frame that can be dated is the building at the far end: the Central Railroad of New Jersey&rsquo;s passenger station, built between 1891 and 1893 to a Wilson Brothers design and on the National Register since 1979. It is still there. The bridge under the photographer&rsquo;s feet is not &mdash; the crossing was rebuilt, and the trolley tracks went with it.",
      "plate": {
        "width": 2048,
        "height": 1271
      },
      "fit": "The two frames arrived already matched to the same framing, so this pair needed no scaling at all &mdash; only a crop to the series ratio, taken off the bottom so the lamp standards and the overhead wires stay whole. The station carries the registration: turret, finials, dormers and the arcade beneath them all superimpose. The bridge does not &mdash; deck, railings, lamps and trolley tracks are all replacements, and only the line of the crossing is old. Both halves are enlarged about three and a half times from 571-pixel originals, so this pair reads softer than the rest of the series; better scans would be worth having."
    },
    {
      "slug": "st-charles-hotel",
      "title": "The St. Charles Hotel",
      "shortTitle": "St. Charles Hotel",
      "location": "128 Penn Avenue",
      "coords": [
        41.40911751423839,
        -75.66667569162247
      ],
      "streetview": "https://www.google.com/maps/@41.4091693,-75.6667878,3a,75y,108.47h,99.64t/data=!3m7!1e1!3m5!1shX94PhuYV8YSvsrZCqzuOA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-9.644312253397402%26panoid%3DhX94PhuYV8YSvsrZCqzuOA%26yaw%3D108.47345963023916!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",
      "then": {
        "year": "c. 1900",
        "alt": "The St. Charles Hotel around 1900: a four-storey brick hotel with a mansard roof, iron balconies and awnings at every floor, a rooftop widow's walk, and the ornate gabled front of the Conway House next door, seen across a street with trolley tracks.",
        "credit": "Photograph, the St. Charles Hotel, Penn Avenue, Scranton. Undated; the Brainerd/Melvin management years and the absence of automobiles place it around 1900. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The site today: a multi-storey concrete parking garage rises over a low brick storefront wrapped in a mural, with a parking lot filling the corner in front.",
        "credit": "Google Street View. Imagery &copy;&nbsp;Google."
      },
      "blurb": "One of the city's first hotels and, for two decades, the unofficial seat of local Democratic politics. Razed in 1913, its replacement razed again in 1956; a parking garage holds the corner now.",
      "pageTitle": "The St. Charles Hotel",
      "description": "The St. Charles Hotel at 128 Penn Avenue, Scranton, one of the city's first hostelries and the unofficial headquarters of local Democratic politics, set against the parking garage that stands on the site today.",
      "heading": "The St.&nbsp;Charles<br>Hotel",
      "compareLabel": "Compare c. 1900 with today. Drag, or use the arrow keys.",
      "standfirst": "One of Scranton&rsquo;s first hostelries, opened July&nbsp;4, 1859 by David Kressler, formerly of the Scranton House, at 128 Penn Avenue across from the DL&amp;W terminal in the wholesale district. From the 1880s until 1902, under the Brainerd family and later Thomas Melvin, it served as the unofficial headquarters of local Democratic politics. John Lohmann ran the Conway House next door at 132&ndash;134 Penn, and Battin&rsquo;s Hardware held the corner at 126. Unable to compete with hotels offering more modern amenities, the St. Charles closed in 1911. The Salvation Army bought the building and razed it in 1913 for a new headquarters, which the Globe Store in turn acquired and razed in 1956 to expand its store and parking.",
      "plate": {
        "width": 1547,
        "height": 2048
      },
      "fit": "Both frames arrived already matched to the corner, so this pair is a straight crop rather than an alignment, and it keeps its source photographs&rsquo; own tall, narrow frame rather than the series&rsquo; usual wide crop &mdash; nothing here is trimmed to fit a fixed ratio. Nothing survives to register against: the hotel, the Salvation Army building that replaced it and the Globe Store expansion that replaced that are all gone, and the parking garage now on the site shares only the corner, not a single wall."
    },
    {
      "slug": "wyoming-ave-theater-row",
      "title": "Wyoming Avenue's Theater Row",
      "shortTitle": "Theater Row",
      "location": "200 block of Wyoming Avenue",
      "coords": [
        41.4095604540505,
        -75.66426057329929
      ],
      "streetview": "https://www.google.com/maps/place/The+Ritz+Theater/@41.4096456,-75.6641157,3a,78.2y,249.46h,93.11t/data=!3m8!1e1!3m6!1sWLnkPJtsyQGqgkXZJCW6og!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-3.1135066109669083%26panoid%3DWLnkPJtsyQGqgkXZJCW6og%26yaw%3D249.45910827088298!7i16384!8i8192!4m15!1m8!3m7!1s0x89c4ded683e2a073:0x3aa302825f09e426!2s224+Wyoming+Ave,+Scranton,+PA+18503!3b1!8m2!3d41.4091196!4d-75.6640339!16s%2Fg%2F11bw425nzm!3m5!1s0x89c4df2357e3f651:0x91564bccd05d3586!8m2!3d41.4091527!4d-75.6644538!16s%2Fg%2F11hymbh7zn?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",
      "then": {
        "year": "1936",
        "alt": "Wyoming Avenue under snow in 1936: a row of theater and restaurant buildings lit with signs for the State, the Academy and the Ritz, whose marquee advertises Charlie Chan's Secret, with a stepped tower rising behind them and cars parked nose-in along the curb.",
        "credit": "Photograph, the 200 block of Wyoming Avenue under snow, 1936. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "The block today: a plain white and tan tower called Bank Towers rises behind a low brick building and a long wall painted with a mural of flowers and jazz musicians, over a surface parking lot.",
        "credit": "Google Street View. Imagery &copy;&nbsp;Google."
      },
      "blurb": "Three theaters and five restaurants lined this block on a snowy night in 1936. All of it is gone now, cleared for a parking lot and a mural.",
      "pageTitle": "Wyoming Avenue's Theater Row",
      "description": "The 200 block of Wyoming Avenue, Scranton, snowbound in 1936 with the State, the Academy and the Ritz theaters lit up over a row of restaurants, set against the parking lot and mural that cover the block today.",
      "heading": "Wyoming Avenue&rsquo;s<br>Theater Row",
      "compareLabel": "Compare 1936 with today. Drag, or use the arrow keys.",
      "standfirst": "On a snowbound evening in 1936, the 200 block of Wyoming Avenue was already jammed with cars outside a row of restaurants and theaters. Diners had their pick of the Blue Lantern, the Tip Toe Inn inside the Plaza Hotel, a chop suey house, the Paris restaurant, or the Wyoma cafeteria, before walking down to a show at the State, the Academy, or the Ritz &mdash; where the marquee that week advertised Charlie Chan&rsquo;s Secret, released just weeks earlier, which is how close a date this photograph can be pinned to. Every building in this stretch is gone now, cleared for the parking lot and mural that cover the block today.",
      "plate": {
        "width": 2048,
        "height": 1530
      },
      "fit": "Frames arrived pre-matched, so this is a straight crop with no scaling, and it keeps the source photograph&rsquo;s own frame rather than the series&rsquo; usual wide crop. The entire theater and restaurant row was demolished; the one thing to register the two shots against is the stepped tower rising behind the block, now labelled Bank Towers, which lines up in both."
    },
    {
      "slug": "spruce-street-trolley",
      "title": "The Last Streetcar",
      "shortTitle": "The Last Streetcar",
      "location": "400 block of Spruce Street",
      "coords": [
        41.40878353258816,
        -75.66507614275912
      ],
      "streetview": "https://www.google.com/maps/@41.4087966,-75.6650781,3a,60y,116.82h,90t/data=!3m7!1e1!3m5!1s6OPOr5B_JH_G8bX64mI9FA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3D6OPOr5B_JH_G8bX64mI9FA%26yaw%3D116.81738207083923!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",
      "then": {
        "year": "1950",
        "alt": "A streetcar reading DUNMORE SUB crosses the 400 block of Spruce Street in 1950, overhead wires crisscrossing above it, with a man crossing in front of it and storefronts, awnings and parked cars lining both sides of the street.",
        "credit": "Photograph, streetcar 507 on Spruce Street on the last day of service, October&nbsp;7, 1950. Lackawanna Historical Society."
      },
      "now": {
        "year": "Today",
        "alt": "Spruce Street today: a glass-fronted modern building on the left where the old storefronts stood, cars in the travel lanes where the streetcar tracks ran, and the same ornate brick building still standing on the right in the distance.",
        "credit": "Google Street View. Imagery &copy;&nbsp;Google."
      },
      "blurb": "Car 507 rolled through here on the last day Scranton's streetcars ran. The tracks and wire are gone; the brick building down toward the corner isn't.",
      "pageTitle": "The Last Streetcar, Spruce Street",
      "description": "Car 507 of the Scranton Transit Co.'s Dunmore Suburban line on the 400 block of Spruce Street, October 7, 1950, the last day of streetcar service in the city that had earned the nickname 'the Electric City.'",
      "heading": "The Last<br>Streetcar",
      "compareLabel": "Compare 1950 with today. Drag, or use the arrow keys.",
      "standfirst": "Car 507 of the Scranton Transit Co.&rsquo;s Dunmore Suburban line rolls west through the 400 block of Spruce Street on October&nbsp;7, 1950 &mdash; the last day electric streetcars ran in a city the streetcars themselves had helped earn the nickname &ldquo;the Electric City&rdquo; by the early 1890s. The lines were phased out through the 1950s and replaced by buses, taking the overhead wire and the rail in the street with them.",
      "plate": {
        "width": 1476,
        "height": 1202
      },
      "fit": "Frames arrived pre-matched, so this is a straight crop with no scaling, and it keeps the source photograph&rsquo;s own frame rather than the series&rsquo; usual wide crop. The ornate brick building on the right, down toward the corner, still stands and anchors the two shots; every storefront on the near side of the street has since been rebuilt."
    }
  ]
};

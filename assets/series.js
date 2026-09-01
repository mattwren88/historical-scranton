/* Builds whatever the current page needs out of the manifest in data/pairs.js:
   the card grid on the index, and the position readout plus prev/next links on
   a pair page. One manifest is the single source of truth, so adding a pair
   never means editing a neighbouring page.

   The manifest arrives as a global set by its own <script> tag rather than over
   fetch(), which keeps the site working when opened straight off disk.

   Pages declare where the site root is with data-root on <html> — "" at the
   root, "../" inside pairs/. */
(function () {
  'use strict';

  var ROOT = document.documentElement.getAttribute('data-root') || '';

  function url(path) { return ROOT + path; }
  function pageFor(slug) { return url('pairs/' + slug + '.html'); }

  function thumb(pair, half) {
    var img = new Image(640, 397);
    img.className = 'card__' + half;
    img.src = url('images/' + pair.slug + '/thumb-' + half + '.jpg');
    img.decoding = 'async';
    return img;
  }

  function card(pair, index) {
    var link = document.createElement('a');
    link.className = 'card';
    link.href = pageFor(pair.slug);

    var frame = document.createElement('div');
    frame.className = 'card__frame';

    var now = thumb(pair, 'now');
    now.alt = pair.title + ', today';

    // The historical plate is decorative here: it only appears on hover, and
    // the link text already names the place.
    var then = thumb(pair, 'then');
    then.alt = '';
    then.setAttribute('aria-hidden', 'true');

    // Roughly the first row is above the fold; everything after can wait.
    if (index >= 3) {
      now.loading = 'lazy';
      then.loading = 'lazy';
    }

    frame.appendChild(now);
    frame.appendChild(then);

    var title = document.createElement('h2');
    title.className = 'card__title';
    title.textContent = pair.shortTitle || pair.title;

    var meta = document.createElement('p');
    meta.className = 'card__meta';
    meta.textContent = pair.location || '';

    var years = document.createElement('span');
    years.className = 'card__years';
    years.textContent = pair.then.year + ' → ' + pair.now.year;
    meta.appendChild(years);

    link.appendChild(frame);
    link.appendChild(title);
    link.appendChild(meta);

    var item = document.createElement('li');
    item.appendChild(link);
    return item;
  }

  function renderGrid(grid, pairs) {
    var frag = document.createDocumentFragment();
    pairs.forEach(function (pair, i) { frag.appendChild(card(pair, i)); });
    grid.textContent = '';
    grid.appendChild(frag);

    var count = document.getElementById('count');
    if (count) {
      count.textContent = pairs.length + (pairs.length === 1 ? ' view' : ' views');
    }
  }

  function walkLink(label, pair, side) {
    var link = document.createElement('a');
    link.className = 'walk__' + side;
    link.href = pageFor(pair.slug);
    link.setAttribute('rel', side === 'prev' ? 'prev' : 'next');

    var tag = document.createElement('b');
    tag.textContent = label;

    var name = document.createElement('span');
    name.textContent = pair.shortTitle || pair.title;

    link.appendChild(tag);
    link.appendChild(name);
    return link;
  }

  function renderNav(slug, pairs) {
    var i = -1;
    pairs.forEach(function (p, n) { if (p.slug === slug) i = n; });
    if (i < 0) return;

    var position = document.getElementById('position');
    if (position) position.textContent = (i + 1) + ' / ' + pairs.length;

    var walk = document.getElementById('walk');
    if (!walk) return;
    if (pairs[i - 1]) walk.appendChild(walkLink('Previous', pairs[i - 1], 'prev'));
    if (pairs[i + 1]) walk.appendChild(walkLink('Next', pairs[i + 1], 'next'));
  }

  function fail(message) {
    var grid = document.getElementById('grid');
    if (!grid) return;
    var note = document.createElement('p');
    note.className = 'grid-error';
    note.textContent = message;
    grid.replaceWith(note);
  }

  function boot() {
    var manifest = window.SCRANTON_PAIRS;
    if (!manifest || !manifest.pairs) {
      fail('The manifest did not load. Check that data/pairs.js is present and that ' +
           'this page includes its <script> tag before assets/series.js.');
      return;
    }

    var pairs = manifest.pairs;
    var grid = document.getElementById('grid');
    if (grid) renderGrid(grid, pairs);

    var slug = document.body.getAttribute('data-pair');
    if (slug) renderNav(slug, pairs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

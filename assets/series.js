/* Builds whatever the current page needs out of the manifest in data/pairs.js:
   the ledger rows on the index, and the "Where" credit plus prev/next links on
   a pair page. One manifest is the single source of truth, so adding a pair
   never means editing a neighbouring page.

   The manifest arrives as a global set by its own <script> tag rather than over
   fetch(), which keeps the site working when opened straight off disk.

   Pages declare where the site root is with data-root on <html> — "" at the
   root, "../" inside pairs/. */
(function () {
  'use strict';

  var ROOT = document.documentElement.getAttribute('data-root') || '';

  var ICONS = {
    pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z',
    chevron: 'M9 18l6-6-6-6',
    chevronLeft: 'M15 18l-6-6 6-6'
  };

  function url(path) { return ROOT + path; }
  function pageFor(slug) { return url('pairs/' + slug + '.html'); }

  // Icons are drawn here rather than shipped as markup so a row stays one
  // <a> built in one place. Lucide geometry, stroked in currentColor.
  function icon(name, gold) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'icon' + (gold ? ' icon--gold' : ''));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', ICONS[name]);
    svg.appendChild(path);
    if (name === 'pin') {
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', '12'); dot.setAttribute('cy', '10'); dot.setAttribute('r', '3');
      svg.appendChild(dot);
    }
    return svg;
  }

  function span(className, text) {
    var el = document.createElement('span');
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function walkLink(pair, side) {
    var link = document.createElement('a');
    link.className = 'walk__' + side;
    link.href = pageFor(pair.slug);
    link.setAttribute('rel', side === 'prev' ? 'prev' : 'next');
    link.appendChild(document.createTextNode(
      (side === 'prev' ? 'Previous — ' : 'Next — ') + (pair.shortTitle || pair.title)));
    link.appendChild(icon(side === 'prev' ? 'chevronLeft' : 'chevron', true));
    return link;
  }

  // Coordinates read N/S and E/W rather than as signed decimals: this is a
  // caption on a page about places, not a data field.
  function formatCoord(value, positive, negative) {
    return Math.abs(value).toFixed(6) + '\u00b0 ' + (value >= 0 ? positive : negative);
  }

  function mapLink(href, text) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  }

  // Adds a "Where" row to the credits table. Pairs without coordinates in the
  // manifest simply don't get one.
  function renderWhere(pair) {
    var body = document.querySelector('.credits tbody');
    if (!body || !pair.coords) return;

    var lat = pair.coords[0], lon = pair.coords[1];
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.setAttribute('scope', 'row');
    var label = span(null, 'Where');
    label.insertBefore(icon('pin', true), label.firstChild);
    th.appendChild(label);

    var td = document.createElement('td');
    td.appendChild(mapLink(
      'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lon,
      formatCoord(lat, 'N', 'S') + ', ' + formatCoord(lon, 'E', 'W')));
    if (pair.streetview) {
      td.appendChild(document.createTextNode(' \u00b7 '));
      td.appendChild(mapLink(pair.streetview, 'Street View'));
    }

    tr.appendChild(th);
    tr.appendChild(td);
    body.appendChild(tr);
  }

  function renderNav(slug, pairs) {
    var i = -1;
    pairs.forEach(function (p, n) { if (p.slug === slug) i = n; });
    if (i < 0) return;

    var walk = document.getElementById('walk');
    if (!walk) return;
    if (pairs[i - 1]) walk.appendChild(walkLink(pairs[i - 1], 'prev'));
    if (pairs[i + 1]) walk.appendChild(walkLink(pairs[i + 1], 'next'));
  }

  function boot() {
    // The ledger is static HTML now; the manifest only drives the pair pages'
    // prev/next links and the "Where" credit. A missing manifest degrades to a
    // page without those, rather than to a page without content.
    var manifest = window.SCRANTON_PAIRS;
    if (!manifest || !manifest.pairs) return;

    var pairs = manifest.pairs;

    var slug = document.body.getAttribute('data-pair');
    if (slug) {
      renderNav(slug, pairs);
      pairs.forEach(function (p) { if (p.slug === slug) renderWhere(p); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

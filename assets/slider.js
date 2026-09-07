/* Then & Now comparison, in three modes.

   Slide  — the historical plate is clipped to a seam that follows the cursor.
            The control is a real <input type="range"> stretched over the plate,
            so the seam lands exactly under the pointer and keyboard and
            screen-reader semantics come for free.
   Fade   — the same 0-100 value cross-dissolves the two plates.
   Blink  — the slider steps aside; clicking the plate swaps the two whole
            views, so the comparison is between complete images rather than
            halves.

   Position and mode live in custom properties and a data-mode attribute scoped
   to the .comparison element, so several can coexist on a page. */
(function () {
  'use strict';

  var ARROW_STEP = 2;   // percent per arrow press
  var SHIFT_STEP = 10;  // percent per shift+arrow

  function init(comparison) {
    var range = comparison.querySelector('.range');
    if (!range) return;

    var stage    = comparison.querySelector('.stage');
    var then     = comparison.querySelector('.yr--then');
    var now      = comparison.querySelector('.yr--now');
    var readout  = comparison.querySelector('.readout');
    var hint     = comparison.querySelector('.hint__text');
    var buttons  = comparison.querySelectorAll('.mode');
    var showThen = true;

    function mode() { return comparison.getAttribute('data-mode') || 'slide'; }

    function label(el) { return el ? el.textContent.trim() : ''; }

    function render() {
      var v = parseFloat(range.value);
      var m = mode();

      comparison.style.setProperty('--pos', v + '%');
      comparison.style.setProperty('--fade', (v / 100).toFixed(3));
      comparison.style.setProperty('--then-shown', showThen ? 1 : 0);

      if (m === 'blink') {
        comparison.style.setProperty('--then-weight', showThen ? 1 : 0.35);
        comparison.style.setProperty('--now-weight', showThen ? 0.35 : 1);
      } else {
        // Each year dims as its own half is squeezed out of the frame.
        comparison.style.setProperty('--then-weight', (0.35 + 0.65 * (v / 100)).toFixed(3));
        comparison.style.setProperty('--now-weight', (0.35 + 0.65 * (1 - v / 100)).toFixed(3));
      }

      if (readout) {
        readout.textContent =
          m === 'blink' ? (showThen ? label(then) + ', whole' : label(now) + ', whole')
        : m === 'fade'  ? Math.round(v) + '% ' + label(then)
        :                 Math.round(v) + '% revealed';
      }

      if (hint) {
        hint.textContent = m === 'blink'
          ? 'Click the plate to swap between the two whole views'
          : 'Drag anywhere on the plate · arrow keys to scrub';
      }

      range.setAttribute('aria-valuetext',
        m === 'blink' ? (showThen ? label(then) : label(now))
                      : Math.round(v) + '% ' + label(then) + ', ' +
                        (100 - Math.round(v)) + '% ' + label(now));
    }

    function setMode(next) {
      comparison.setAttribute('data-mode', next);
      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === next));
      });
      render();
    }

    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });

    range.addEventListener('input', render);

    // The 0.1 step exists so dragging is smooth; that makes the native arrow
    // key increment far too small, so take the keys over and move a useful
    // distance instead.
    range.addEventListener('keydown', function (e) {
      var dir = (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') ? -1
              : (e.key === 'ArrowRight' || e.key === 'ArrowUp')   ?  1 : 0;
      if (!dir) return;
      e.preventDefault();
      var step = e.shiftKey ? SHIFT_STEP : ARROW_STEP;
      range.value = Math.min(100, Math.max(0, parseFloat(range.value) + dir * step));
      render();
    });

    if (stage) {
      stage.addEventListener('click', function () {
        if (mode() !== 'blink') return;
        showThen = !showThen;
        render();
      });
    }

    // Full-width toggle: grows the stage from its usual 60% share to the
    // full row, which pushes the sidecar onto its own line below (flex-wrap,
    // in site.css) rather than shrinking its column to nothing. The reflow
    // itself — sidecar jumping from beside the stage to below it, or back —
    // happens partway through the width transition, at whatever moment it
    // stops fitting on the line, so the sidecar fades out the instant the
    // width starts moving (not after a wait — waiting to start was the jank)
    // and stays hidden for exactly as long as the width transition takes,
    // then fades back in wherever it landed. That fade-in is also what makes
    // it "reappear" when collapsing back to normal.
    var GROW_MS = 450;
    var expandBtn = comparison.querySelector('.expand');
    var pairEl = comparison.closest('.pair');
    var transitTimer = null;
    if (expandBtn && pairEl) {
      expandBtn.addEventListener('click', function () {
        var wide = !pairEl.classList.contains('pair--wide');
        expandBtn.setAttribute('aria-pressed', String(wide));
        expandBtn.setAttribute('aria-label', wide ? 'Collapse the plate' : 'Expand the plate to full width');

        clearTimeout(transitTimer);
        pairEl.classList.add('pair--transit');
        pairEl.classList.toggle('pair--wide', wide);
        transitTimer = setTimeout(function () {
          pairEl.classList.remove('pair--transit');
        }, GROW_MS);
      });
    }

    setMode(mode());
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('.comparison'), init);
  }

  // Both scripts load with defer, so the document is parsed by the time this
  // runs — see the <script> tags in the page template.
  boot();
})();

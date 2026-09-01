/* Then & Now comparison slider.
   Wires every .comparison block on the page, so a pair page is pure markup.

   The control is a real <input type="range"> stretched over the image: that
   buys native pointer dragging, native keyboard handling and correct
   screen-reader semantics for free. The seam position lives in a --pos custom
   property scoped to the .comparison element, so several can coexist. */
(function () {
  'use strict';

  var ARROW_STEP = 2;   // percent per arrow press
  var SHIFT_STEP = 10;  // percent per shift+arrow

  function init(comparison) {
    var range = comparison.querySelector('.range');
    if (!range) return;

    var wrap = comparison.querySelector('.stage-wrap');
    var then = comparison.querySelector('.yr--then');
    var now  = comparison.querySelector('.yr--now');

    function render(v) {
      comparison.style.setProperty('--pos', v + '%');
      // Each year dims as its own half is squeezed out of the frame.
      comparison.style.setProperty('--then-weight', (0.4 + 0.6 * (v / 100)).toFixed(3));
      comparison.style.setProperty('--now-weight',  (0.4 + 0.6 * (1 - v / 100)).toFixed(3));

      if (then && now) {
        var pct = Math.round(v);
        range.setAttribute('aria-valuetext',
          pct + '% ' + then.textContent.trim() + ', ' +
          (100 - pct) + '% ' + now.textContent.trim());
      }
    }

    function touched() {
      if (wrap) wrap.classList.add('touched');
    }

    range.addEventListener('input', function () {
      touched();
      render(parseFloat(range.value));
    });

    // The 0.1 step exists so dragging is smooth; that makes the native arrow
    // key increment far too small, so take the keys over and move a useful
    // distance instead.
    range.addEventListener('keydown', function (e) {
      var dir = (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') ? -1
              : (e.key === 'ArrowRight' || e.key === 'ArrowUp')   ?  1 : 0;
      if (!dir) return;
      e.preventDefault();

      var step = e.shiftKey ? SHIFT_STEP : ARROW_STEP;
      var next = Math.min(100, Math.max(0, parseFloat(range.value) + dir * step));
      range.value = next;
      touched();
      render(next);
    });

    render(parseFloat(range.value));
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('.comparison'), init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

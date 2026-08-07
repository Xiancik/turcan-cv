(function () {
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  var icon = btn.querySelector('.theme-toggle__icon');

  function render() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (icon) icon.textContent = dark ? '☀' : '☾'; // sun when dark, moon when light
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
  }

  btn.addEventListener('click', function () {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) {}
    render();
  });

  render();
})();

/* ---- Note connectors ----
   Draw a thin pen line from each handwritten margin note to the content it
   annotates (or the exact phrase marked with .ann-t). Runtime-drawn into a
   full-page SVG overlay so the lines stay aligned across widths and font
   loads. Wide screens only; hidden below the scatter breakpoint. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var GAP = 10, MINW = 1100;
  var overlay = null;

  function contentEl(ctx) {
    if (ctx.classList.contains('role')) return ctx.querySelector('.role__body');
    if (ctx.classList.contains('paper')) return ctx.querySelector('.paper__body');
    if (ctx.classList.contains('event')) return ctx.querySelectorAll(':scope > div')[1];
    if (ctx.classList.contains('page-head--noted')) return ctx.querySelector('p:not(.note-hand)') || ctx.querySelector('h1');
    if (ctx.classList.contains('intro')) return ctx.querySelector('.intro__body');
    return null;
  }

  function stroke(el) {
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', 'currentColor');
    el.setAttribute('stroke-width', '1.3');
    el.setAttribute('stroke-linecap', 'round');
    overlay.appendChild(el);
  }

  function connector(x1, y1, x2, y2) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 7; // gentle upward bow
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M' + x1 + ',' + y1 + ' Q' + mx + ',' + my + ' ' + x2 + ',' + y2);
    stroke(p);
    var ang = Math.atan2(y2 - my, x2 - mx), a = 7;
    [ang + 2.5, ang - 2.5].forEach(function (t) {
      var h = document.createElementNS(NS, 'path');
      h.setAttribute('d', 'M' + x2 + ',' + y2 + ' L' + (x2 - a * Math.cos(t)) + ',' + (y2 - a * Math.sin(t)));
      stroke(h);
    });
  }

  function draw() {
    try {
      if (overlay) overlay.innerHTML = '';
      if (window.innerWidth < MINW) return;
      if (!overlay) {
        overlay = document.createElementNS(NS, 'svg');
        overlay.id = 'note-lines';
        overlay.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;overflow:visible;opacity:0.85';
        document.body.appendChild(overlay);
      }
      overlay.setAttribute('width', document.documentElement.scrollWidth);
      overlay.setAttribute('height', document.documentElement.scrollHeight);
      var sx = window.scrollX, sy = window.scrollY;
      var notes = document.querySelectorAll('.role__note, .note-hand');
      Array.prototype.forEach.call(notes, function (note) {
        var ctx = note.closest('.role, .paper, .event, .page-head--noted, .intro');
        if (!ctx) return;
        var content = contentEl(ctx);
        if (!content) return;
        var ann = ctx.querySelector('.ann-t');
        var target = ann || content;
        var nr = note.getBoundingClientRect();
        if (ann && getComputedStyle(note).position === 'absolute') {
          var er = ctx.getBoundingClientRect(), ta = ann.getBoundingClientRect();
          note.style.top = ((ta.top - er.top) + ta.height / 2 - note.offsetHeight / 2) + 'px';
          nr = note.getBoundingClientRect();
        }
        var tr = target.getBoundingClientRect();
        var noteRight = (nr.left + nr.right) / 2 > (tr.left + tr.right) / 2;
        var x1 = noteRight ? nr.left : nr.right;
        var x2 = noteRight ? tr.right + GAP : tr.left - GAP;
        var y1 = nr.top + nr.height / 2;
        var y2 = ann ? (tr.top + tr.height / 2) : y1;
        connector(x1 + sx, y1 + sy, x2 + sx, y2 + sy);
      });
    } catch (e) {}
  }

  var raf;
  function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
  window.addEventListener('resize', schedule);
  window.addEventListener('load', draw);
  document.addEventListener('DOMContentLoaded', draw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();

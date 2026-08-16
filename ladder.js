/* Pl. I — link each lettered key to its mark on the section drawing.
   Hovering or focusing either side lights both. */
(function () {
  var ladder = document.querySelector('.ladder');
  if (!ladder) return;

  var parts = ladder.querySelectorAll('[data-key]');

  function set(key, on) {
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].dataset.key === key) parts[i].classList.toggle('is-on', on);
    }
  }

  parts.forEach(function (el) {
    var key = el.dataset.key;
    el.addEventListener('mouseenter', function () { set(key, true); });
    el.addEventListener('mouseleave', function () { set(key, false); });
    el.addEventListener('focusin', function () { set(key, true); });
    el.addEventListener('focusout', function () { set(key, false); });
  });

  /* Tapping a mark scrolls its key into view on narrow screens. */
  ladder.querySelectorAll('.ladder__mark').forEach(function (mark) {
    mark.addEventListener('click', function () {
      var item = ladder.querySelector('.ladder__item[data-key="' + mark.dataset.key + '"]');
      if (item) item.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  });
})();

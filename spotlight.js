// Card-to-card spotlight: hover / focus a child of a .spotlight container
// and its siblings dim + desaturate. Paired with the .spotlight CSS.
(function () {
  document.querySelectorAll('.spotlight').forEach(function (group) {
    var items = Array.prototype.slice.call(group.children);
    if (items.length < 2) return;
    var setHot = function (target) {
      group.classList.toggle('is-spot', !!target);
      items.forEach(function (c) { c.classList.toggle('is-hot', c === target); });
    };
    items.forEach(function (c) {
      c.addEventListener('mouseenter', function () { setHot(c); });
      c.addEventListener('focusin',    function () { setHot(c); });
    });
    group.addEventListener('mouseleave', function () { setHot(null); });
    group.addEventListener('focusout', function (e) {
      if (!group.contains(e.relatedTarget)) setHot(null);
    });
  });
})();

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

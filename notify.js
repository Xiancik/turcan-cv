(function () {
  // Set this after deploying the worker (see notify/README.md).
  var ENDPOINT = "https://turcan-cv-notify.xiancik.workers.dev/notify";

  // Dedupe window (ms) so a refresh burst doesn't spam Telegram.
  var DEDUPE_MS = 60 * 1000;

  try {
    if (!ENDPOINT || ENDPOINT.indexOf("YOUR-SUBDOMAIN") !== -1) return;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
    if (navigator.webdriver) return;

    var key = "notify:" + location.pathname;
    var now = Date.now();
    var last = 0;
    try { last = parseInt(sessionStorage.getItem(key) || "0", 10) || 0; } catch (e) {}
    if (now - last < DEDUPE_MS) return;
    try { sessionStorage.setItem(key, String(now)); } catch (e) {}

    var payload = {
      path: location.pathname + location.search,
      title: document.title || "",
      referrer: document.referrer || "",
      screen: (screen.width || 0) + "x" + (screen.height || 0),
      lang: navigator.language || "",
    };

    var body = JSON.stringify(payload);
    var sent = false;
    if (navigator.sendBeacon) {
      try {
        sent = navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain" }));
      } catch (e) {}
    }
    if (!sent) {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: body,
        keepalive: true,
        mode: "cors",
      }).catch(function () {});
    }
  } catch (e) {}
})();

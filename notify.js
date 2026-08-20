(function () {
  // Set this after deploying the worker (see notify/README.md).
  var ENDPOINT = "https://turcan-cv-notify.xiancik.workers.dev/notify";

  // Dedupe window (ms): one ping per visitor per 24h, across pages, tabs, and sessions.
  var DEDUPE_MS = 24 * 60 * 60 * 1000;

  try {
    if (!ENDPOINT || ENDPOINT.indexOf("YOUR-SUBDOMAIN") !== -1) return;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
    if (navigator.webdriver) return;
    // Honor Do Not Track and Global Privacy Control.
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.msDoNotTrack === "1") return;
    if (navigator.globalPrivacyControl === true) return;

    var key = "notify:sent";
    var now = Date.now();
    var last = 0;
    try { last = parseInt(localStorage.getItem(key) || "0", 10) || 0; } catch (e) {}
    if (now - last < DEDUPE_MS) return;
    try { localStorage.setItem(key, String(now)); } catch (e) {}

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

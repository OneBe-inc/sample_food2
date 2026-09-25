(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const returning =
    performance.getEntriesByType("navigation")[0]?.type === "back_forward";
  if (
    root.dataset.page !== "home" ||
    returning ||
    reducedMotion ||
    location.hash
  )
    return;

  root.classList.add("is-loading");
  let finished = false;
  let deadline;
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(deadline);
    root.classList.add("is-loading-leaving");
    const shell = document.querySelector("#site-shell");
    if (shell) {
      shell.inert = false;
      shell.removeAttribute("aria-busy");
    }
    const loader = document.querySelector("#site-loader");
    if (loader?.contains(document.activeElement)) {
      const main = document.querySelector("#main");
      main?.setAttribute("tabindex", "-1");
      main?.focus({ preventScroll: true });
    }
    loader?.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      root.classList.remove("is-loading", "is-loading-leaving");
      if (loader) loader.hidden = true;
    }, 360);
  }
  // Start the escape timer before touching the DOM; a stalled image must not block the site.
  deadline = setTimeout(finish, 3200);
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      if (finished) return;
      const loader = document.querySelector("#site-loader");
      // Never reveal an unstyled overlay (for example after a cached or failed CSS response).
      if (!loader || getComputedStyle(loader).position !== "fixed") {
        finish();
        return;
      }
      const shell = document.querySelector("#site-shell");
      shell.inert = true;
      shell.setAttribute("aria-busy", "true");
      loader.hidden = false;
      loader.setAttribute("aria-hidden", "false");
      document.querySelector(".loader-skip").addEventListener("click", finish);
      const pictures = [
        ...document.querySelectorAll(".loader-logo img, .hero-picture img"),
      ];
      const assetsReady = Promise.all(
        pictures.map((img) => img.decode().catch(() => {})),
      );
      Promise.all([
        assetsReady,
        new Promise((resolve) => setTimeout(resolve, 1800)),
      ]).then(finish);
    },
    { once: true },
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") finish();
  });
  addEventListener("pageshow", (event) => {
    if (event.persisted) finish();
  });
})();

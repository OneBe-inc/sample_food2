(() => {
  const root = document.documentElement;
  const key = "udebiya-intro-v1";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const returning =
    performance.getEntriesByType("navigation")[0]?.type === "back_forward";
  let seen = false;
  try {
    seen = sessionStorage.getItem(key) === "seen";
  } catch {
    /* Storage may be disabled. */
  }
  if (seen || returning || reducedMotion || location.hash) return;

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
    try {
      sessionStorage.setItem(key, "seen");
    } catch {
      /* The page remains usable without storage. */
    }
    setTimeout(
      () => root.classList.remove("is-loading", "is-loading-leaving"),
      360,
    );
  }
  // Start the escape timer before touching the DOM; a stalled image must not block the site.
  deadline = setTimeout(finish, 2800);
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      if (finished) return;
      const shell = document.querySelector("#site-shell");
      shell.inert = true;
      shell.setAttribute("aria-busy", "true");
      document
        .querySelector("#site-loader")
        .setAttribute("aria-hidden", "false");
      document.querySelector(".loader-skip").addEventListener("click", finish);
      const pictures = [
        ...document.querySelectorAll(".loader-logo img, .hero-picture img"),
      ];
      const assetsReady = Promise.all(
        pictures.map((img) => img.decode().catch(() => {})),
      );
      Promise.all([
        assetsReady,
        new Promise((resolve) => setTimeout(resolve, 1250)),
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

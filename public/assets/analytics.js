(() => {
  const measurementId = document.querySelector(
    'meta[name="ga4-measurement-id"]',
  )?.content;
  const isPublishedSite =
    location.origin === "https://onebe-inc.github.io" &&
    location.pathname.startsWith("/sample_food2/");
  if (
    !/^G-[A-Z0-9]{6,15}$/.test(measurementId || "") ||
    !isPublishedSite ||
    window[`ga-disable-${measurementId}`]
  )
    return;

  // A single config call sends the initial pageview. No duplicate manual page_view.
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  const cleanUrl = (value) => {
    try {
      const url = new URL(value);
      return url.origin + url.pathname;
    } catch {
      return "";
    }
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    page_location: cleanUrl(location.href),
    page_referrer: cleanUrl(document.referrer),
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_prefix: "udebiya",
    cookie_path: "/sample_food2/",
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
  const track = (name, parameters = {}) => {
    if (window[`ga-disable-${measurementId}`]) return;
    window.gtag("event", name, {
      send_to: measurementId,
      site_name: "udebiya",
      ...parameters,
    });
  };
  const placement = (element) =>
    element.closest("header")
      ? "header"
      : element.closest("footer")
        ? "footer"
        : element.closest(".mobile-nav")
          ? "mobile_navigation"
          : "content";
  if (document.body.dataset.page === "menu") track("menu_view");
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-dialog]");
    const names = {
      contact: "contact_open",
      access: "store_info_open",
      recruit: "recruit_info_open",
      opening: "news_open",
    };
    if (button && names[button.dataset.dialog])
      track(names[button.dataset.dialog], {
        placement: placement(button),
        is_demo: true,
      });
    const link = event.target.closest("a[href]");
    if (!link) return;
    const url = new URL(link.href);
    if (
      url.origin !== location.origin ||
      !url.pathname.startsWith("/sample_food2/")
    )
      return;
    const anchors = ["#about", "#menu", "#access", "#news", "#space", "#top"];
    const destination =
      url.pathname + (anchors.includes(url.hash) ? url.hash : "");
    track("navigation_click", { destination, placement: placement(link) });
  });
  const thresholds = new Set([25, 50, 75, 90]);
  let pending = false;
  addEventListener(
    "scroll",
    () => {
      if (pending || !thresholds.size) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const distance = document.documentElement.scrollHeight - innerHeight;
        if (distance <= 0) return;
        const percent = (scrollY / distance) * 100;
        for (const threshold of thresholds)
          if (percent >= threshold) {
            track("scroll_depth", { percent_scrolled: threshold });
            thresholds.delete(threshold);
          }
      });
    },
    { passive: true },
  );
})();

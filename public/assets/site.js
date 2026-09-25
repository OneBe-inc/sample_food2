const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#mobile-nav");
const info = document.querySelector(".info-dialog");
let dialogTrigger;
// Keep Tab inside the modal, including browsers that otherwise focus browser chrome.
for (const modal of [menu, info])
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const items = [
      ...modal.querySelectorAll(
        'a[href],button,input,select,textarea,[tabindex="0"]',
      ),
    ].filter((el) => !el.disabled && el.getClientRects().length);
    const first = items[0],
      last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
function closeMenu() {
  if (menu.open) menu.close();
}
toggle.addEventListener("click", () => {
  menu.showModal();
  toggle.setAttribute("aria-expanded", "true");
});
menu.querySelector(".nav-close").addEventListener("click", closeMenu);
menu.addEventListener("close", () => {
  toggle.setAttribute("aria-expanded", "false");
  toggle.focus({ preventScroll: true });
});
menu.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (link) {
    closeMenu();
    const url = new URL(link.href);
    if (url.pathname === location.pathname && url.hash) {
      const target = document.querySelector(url.hash);
      if (target) {
        target.setAttribute("tabindex", "-1");
        setTimeout(() => target.focus({ preventScroll: true }), 0);
      }
    }
  }
  if (event.target === menu) {
    const r = menu.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right) closeMenu();
  }
});
matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
const messages = {
  contact: [
    "ご予約・お問い合わせ",
    "<p>腕火屋のサイトをご覧いただき、ありがとうございます。</p><p>こちらは架空店舗のデモサイトです。実際のご予約・お問い合わせは受け付けておりません。</p><p>個人情報の入力や外部への送信は行いません。</p>",
  ],
  access: [
    "店舗情報",
    '<dl class="info-list"><div><dt>店名</dt><dd>腕火屋（うでびや）</dd></div><div><dt>開業予定</dt><dd>2026年10月（仮設定）</dd></div><div><dt>駐車場</dt><dd>完備（仮設定）</dd></div><div><dt>所在地・電話</dt><dd>未設定</dd></div><div><dt>営業時間</dt><dd>未設定</dd></div></dl><p class="fine">架空店舗のため、地図や実際の連絡先はありません。</p>',
  ],
  opening: [
    "2026年10月、腕火屋。",
    '<p>本格家系を、腕と火で食わせる。</p><p>濃厚豚骨醤油スープ、力強い中太麺、妥協しない具材。一杯に想いを込める「腕火屋」の開業をイメージしたご案内です。</p><p class="fine">開業日は仮設定です。実際の店舗のオープン告知ではありません。</p>',
  ],
  recruit: [
    "採用について",
    "<p>こちらは架空店舗の採用ページです。現在、実際の求人募集は行っておりません。</p><p>応募情報や個人情報の入力・送信は行いません。</p>",
  ],
};
document.querySelectorAll("[data-dialog]").forEach((button) =>
  button.addEventListener("click", () => {
    const message = messages[button.dataset.dialog];
    if (!message) return;
    dialogTrigger = button;
    document.querySelector("#dialog-title").textContent = message[0];
    document.querySelector("#dialog-body").innerHTML = message[1];
    info.showModal();
  }),
);
info.addEventListener("close", () =>
  dialogTrigger?.focus({ preventScroll: true }),
);
info.addEventListener("click", (event) => {
  if (event.target !== info) return;
  const r = info.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    info.close();
});
const preferences = document.querySelector("#preference-form");
preferences?.addEventListener("change", () => {
  const values = new FormData(preferences);
  document.querySelector("#preference-summary").textContent =
    `麺：${values.get("noodle")} ／ 味：${values.get("flavor")} ／ 油：${values.get("oil")}`;
});
preferences?.addEventListener("submit", (event) => event.preventDefault());

// Keep decorative steam idle when the hero is off screen or the tab is hidden.
const hero = document.querySelector(".hero");
const steamToggle = document.querySelector(".steam-toggle");
const steam = document.querySelector(".hero-steam");
if (
  hero &&
  steamToggle &&
  steam &&
  getComputedStyle(steam).position === "absolute"
) {
  steam.hidden = false;
  let visible = false;
  let enabled = true;
  const syncSteam = () =>
    hero.classList.toggle(
      "is-steam-active",
      visible && enabled && !document.hidden,
    );
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncSteam();
  });
  observer.observe(hero);
  document.addEventListener("visibilitychange", syncSteam);
  steamToggle.hidden = false;
  steamToggle.addEventListener("click", () => {
    enabled = !enabled;
    hero.classList.toggle("is-steam-disabled", !enabled);
    steamToggle.setAttribute("aria-pressed", String(enabled));
    steamToggle.setAttribute(
      "aria-label",
      enabled ? "湯気の動きを止める" : "湯気の動きを再生する",
    );
    steamToggle.textContent = enabled ? "湯気 ON" : "湯気 OFF";
    syncSteam();
  });
}

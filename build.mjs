import fs from "node:fs/promises";
import path from "node:path";
const out = path.join(import.meta.dirname, "public");
const site = "https://onebe-inc.github.io/sample_food2/";
const description =
  "本格家系を、腕と火で食わせる。横浜家系らーめん「腕火屋」のデモサイト。濃厚豚骨醤油、力強い中太麺、妥協しない具材。";
const nav = [
  ["#about", "こだわり"],
  ["menu/", "メニュー"],
  ["#access", "店舗情報"],
  ["#news", "お知らせ"],
  ["recruit/", "採用情報"],
];
const dishes = [
  ["家系らーめん", "900"],
  ["味玉らーめん", "1,020"],
  ["チャーシュー麺", "1,200"],
  ["特製 腕火らーめん", "1,180"],
];
const extras = [
  ["ライス", "150"],
  ["大ライス", "200"],
  ["海苔増し", "150"],
  ["味玉", "120"],
];
const prices = (items) =>
  `<dl class="price-list">${items.map(([n, p]) => `<div><dt>${n}</dt><dd>${p}<small>円</small></dd></div>`).join("")}</dl>`;
const logo = (base, cls = "") =>
  `<img class="${cls}" src="${base}assets/logo.png" alt="腕火屋 UDEBIYA" width="610" height="208"><span class="brand-seal" aria-hidden="true">横浜<br>家系</span>`;
const links = (base) =>
  nav.map(([url, label]) => `<a href="${base}${url}">${label}</a>`).join("");
const contact = `<button class="button button-red" data-dialog="contact">ご予約・お問い合わせ <span aria-hidden="true">→</span></button>`;
const photo = (name, alt, base = "./", cls = "section-photo") =>
  `<img class="${cls}" src="${base}assets/${name}.webp" srcset="${base}assets/${name}-800.webp 800w, ${base}assets/${name}.webp ${name === "bowl" ? 900 : 1672}w" sizes="(max-width: 700px) 100vw, 100vw" alt="${alt}" width="${name === "bowl" ? 900 : 1672}" height="${name === "bowl" ? 900 : 941}" loading="lazy" decoding="async">`;
const shell = (title, body, page = "home") => {
  const base = page === "home" ? "./" : "../";
  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}｜横浜家系らーめん 腕火屋</title><meta name="description" content="${description}"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#090908"><link rel="icon" href="${base}assets/favicon.svg"><link rel="stylesheet" href="${base}assets/site.css"><script src="${base}assets/site.js" defer></script>
<meta property="og:type" content="website"><meta property="og:locale" content="ja_JP"><meta property="og:site_name" content="腕火屋"><meta property="og:title" content="${title}｜腕火屋"><meta property="og:description" content="${description}"><meta property="og:url" content="${site}${page === "home" ? "" : page + "/"}"><meta property="og:image" content="${site}assets/ogp.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="濃厚豚骨醤油の家系らーめんのイメージ"><meta name="twitter:card" content="summary_large_image"></head>
<body id="top" data-page="${page}"><a class="skip" href="#main">本文へ進む</a><header class="header"><a class="brand" href="${base}" aria-label="腕火屋 トップ">${logo(base)}</a><nav class="desktop-nav" aria-label="メインナビゲーション">${links(base)}</nav><div class="header-actions">${contact}<button class="menu-toggle" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span><span></span></button></div></header>
<dialog class="mobile-nav" id="mobile-nav" aria-labelledby="nav-title"><div class="nav-top"><p id="nav-title">腕火屋 <small>UDEBIYA</small></p><button class="nav-close" aria-label="メニューを閉じる">×</button></div><nav aria-label="モバイルナビゲーション">${links(base)}</nav><p class="nav-bottom">一杯に、魂を込めて。</p></dialog>
<main id="main">${body}</main><footer class="footer"><div class="footer-main"><a class="brand" href="${base}" aria-label="腕火屋 トップ">${logo(base)}</a><nav aria-label="フッターナビゲーション">${links(base)}</nav>${contact}</div><div class="footer-note"><p>このサイトは架空の店舗のデモサイトです。店舗・価格・開業日は仮設定で、写真はAI生成のイメージです。</p><a href="${base}company/">サイトについて</a><small>© 2026 UDEBIYA</small><a href="#top" aria-label="ページの先頭へ">↑</a></div></footer>
<dialog class="info-dialog" aria-labelledby="dialog-title"><form method="dialog"><button class="dialog-close" aria-label="閉じる">×</button></form><p class="eyebrow">UDEBIYA / DEMO INFORMATION</p><h2 id="dialog-title"></h2><div id="dialog-body"></div><form method="dialog"><button class="button button-red">閉じる <span aria-hidden="true">→</span></button></form></dialog></body></html>`;
};
const opening = `<p class="open-date">2026.10 <span>GRAND OPEN</span></p><p class="open-note">この一杯が、また誰かの伝説になる。</p>`;
const catchphrase = `<span class="catch-first">本格家系を、</span><span class="catch-second"><em class="brush-word"><img src="./assets/ude.png" alt="腕" width="106" height="99"></em>と<em class="brush-word"><img src="./assets/hi.png" alt="火" width="119" height="113"></em>で食わせる。</span>`;
const car = `<svg viewBox="0 0 48 40" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m8 16 5-11h22l5 11M6 18h36v15H6zM10 33v4m28-4v4M3 16h5m32 0h5M13 23h3m16 0h3M15 29h18"/></svg>`;
const home = `<section class="hero" aria-labelledby="hero-name"><picture class="hero-picture"><source media="(max-width: 700px)" srcset="./assets/hero-mobile.webp"><img src="./assets/hero.webp" alt="湯気の立つ濃厚豚骨醤油らーめん。海苔、ほうれん草、チャーシューと、箸で持ち上げた中太麺" width="1671" height="941" fetchpriority="high"></picture><div class="hero-shade"></div><p class="hero-motto">一杯に、魂を込めて。</p><div class="hero-content"><p class="hero-category">横浜家系らーめん</p><h1 id="hero-name"><picture><source media="(max-width: 700px)" srcset="./assets/logo-vertical.png"><img src="./assets/logo.png" alt="腕火屋" width="610" height="208"></picture><span class="hero-seal" aria-hidden="true">横浜<br>家系</span></h1><p class="hero-catch">${catchphrase}</p><p class="hero-description">濃厚豚骨醤油 <span>／</span> 麺・スープ・具材に妥協なし <span>／</span> 駐車場完備</p></div><div class="hero-opening">${opening}</div><a class="hero-scroll" href="#about"><span>SCROLL</span><i aria-hidden="true"></i></a><a class="parking" href="#access">${car}<span>駐車場<br>完備</span></a></section>
<section class="concept photo-section" id="about" aria-labelledby="concept-title">${photo("chef", "厨房でスープと向き合う職人の後ろ姿")}<div class="concept-mark" aria-hidden="true"><span class="enso"></span><img src="./assets/ude.png" alt="" width="106" height="99"><span>と</span><img src="./assets/hi.png" alt="" width="119" height="113"></div><div class="concept-copy"><p class="eyebrow">OUR SPIRIT</p><h2 id="concept-title">腕と火がつくる、<br>本物の一杯。</h2><p>ただのラーメンではない。<br>炊き続ける、研ぎ澄ます、仕込み続ける。<br>その積み重ねが、腕火屋の一杯になる。<br>家系の誇りを、ここから。</p></div></section>
<section class="craft photo-section soup" aria-labelledby="soup-title">${photo("soup", "寸胴からすくった濃厚な豚骨醤油スープ")}<div class="craft-copy"><h2 id="soup-title">一、炊く。</h2><h3>濃厚豚骨醤油スープ</h3><p>じっくりと炊き上げた豚骨から<br>生まれる、濃厚でまろやかな旨味。<br>継ぎ足しではなく、その日の一杯のために<br>丁寧に炊き上げる。</p></div></section>
<section class="craft photo-section noodles" aria-labelledby="noodle-title"><div class="noodle-photo">${photo("hero", "濃厚なスープをまとった力強い中太麺")}</div><div class="craft-copy"><h2 id="noodle-title">二、絡む。</h2><h3>力強い中太麺</h3><p>濃厚なスープをしっかり受け止める、<br>もっちりとした中太麺。<br>一口ごとに広がる、小麦の香りと<br>力強い食感。</p></div></section>
<section class="craft photo-section pork" aria-labelledby="pork-title">${photo("pork", "丁寧に切り分けた厚切りチャーシュー")}<div class="craft-copy"><h2 id="pork-title">三、仕込む。</h2><h3>妥協しない具材</h3><p>旨さを支えるのは、麺とスープだけじゃない。<br>チャーシュー、海苔、ほうれん草。<br>すべての具材に、妥協はない。</p></div></section>
<section class="menu-section" id="menu" aria-labelledby="menu-title"><div class="menu-intro"><p class="eyebrow">OUR RAMEN</p><h2 id="menu-title" class="brush-heading">メニュー</h2><p>一杯に、すべてを込めて。</p><a class="button button-outline" href="./menu/">メニュー一覧を見る <span aria-hidden="true">→</span></a></div><figure class="signature">${photo("bowl", "味玉、チャーシュー、海苔をのせた特製 腕火らーめん", "./", "bowl-photo")}<figcaption>特製 腕火らーめん <span>1,180円</span></figcaption></figure><div class="menu-prices">${prices(dishes)}${prices(extras)}<p class="fine">表示価格は税込・サンプル価格です。</p></div></section>
<section class="space photo-section" id="space" aria-labelledby="space-title">${photo("room", "木のカウンターと暖かな灯りが迎える店内のイメージ")}<div class="space-copy"><h2 id="space-title" class="brush-heading">店内</h2><h3>ラーメンと、<br>向き合える場所。</h3><p>木の温もりと、熱気。<br>一杯に集中できる、<br>シンプルで心地よい空間です。</p></div></section>
<section class="access photo-section" id="access" aria-labelledby="access-title">${photo("exterior", "駐車場を備えた郊外の腕火屋の外観イメージ")}<div class="access-copy"><h2 id="access-title" class="brush-heading">店舗情報</h2><p>駐車場完備。<br>お車でも安心して<br>お越しいただけます。</p><button class="button button-outline" data-dialog="access">店舗情報を見る <span aria-hidden="true">→</span></button></div><div class="access-opening"><span class="enso" aria-hidden="true"></span>${opening}<p class="fine">2026年10月オープン予定（仮設定）</p></div></section>
<section class="news" id="news" aria-labelledby="news-title"><h2 id="news-title">お知らせ</h2><button data-dialog="opening"><time datetime="2026-10">2026.10</time><span>腕火屋、グランドオープン。<small>デモサイトの開業案内です。</small></span><b aria-hidden="true">→</b></button></section>`;
const menu = `<div class="subpage-heading"><p class="eyebrow">THE MENU</p><h1>メニュー</h1><p>一杯に、すべてを込めて。</p></div><div class="menu-detail"><figure class="signature">${photo("bowl", "特製 腕火らーめんのイメージ", "../", "bowl-photo")}<figcaption>特製 腕火らーめん <span>1,180円</span></figcaption></figure><div><h2>らーめん</h2>${prices(dishes)}<p>豚骨の旨味、醤油のキレ、もっちりとした中太麺。<br>腕火屋の一杯を、お好みで。</p><h2>ご飯・トッピング</h2>${prices(extras)}<p class="fine">すべて税込・架空のサンプル価格です。</p></div></div><section class="preferences"><h2>お好みの一杯に。</h2><p>麺の硬さ、味の濃さ、油の量。お好みを選んでみてください。</p><form id="preference-form">${[
  ["麺の硬さ", "noodle", ["硬め", "普通", "柔らかめ"]],
  ["味の濃さ", "flavor", ["濃いめ", "普通", "薄め"]],
  ["油の量", "oil", ["多め", "普通", "少なめ"]],
]
  .map(
    ([label, name, opts]) =>
      `<fieldset><legend>${label}</legend>${opts.map((o) => `<label><input type="radio" name="${name}" value="${o}" ${o === "普通" ? "checked" : ""}><span>${o}</span></label>`).join("")}</fieldset>`,
  )
  .join(
    "",
  )}<p id="preference-summary" role="status" aria-live="polite">麺：普通 ／ 味：普通 ／ 油：普通</p><p class="fine">お好みを試すデモです。注文・送信は行いません。</p></form></section>`;
const recruit = `<div class="subpage-heading"><p class="eyebrow">JOIN OUR KITCHEN</p><h1>その腕で、<br>誰かの一杯を。</h1><p>料理が好き。ラーメンが好き。<br>その想いを、一杯に込めて。</p></div>${photo("chef", "一杯に向き合う職人のイメージ", "../", "subpage-photo")}<section class="subpage-info"><h2>採用情報</h2><dl class="info-list"><div><dt>職種</dt><dd>キッチン・ホールスタッフ</dd></div><div><dt>業務内容</dt><dd>調理補助・接客・店舗運営</dd></div><div><dt>勤務条件</dt><dd>実際の募集時にご案内します</dd></div><div><dt>応募受付</dt><dd>現在は募集しておりません</dd></div></dl><button class="button button-red" data-dialog="recruit">採用について <span aria-hidden="true">→</span></button><p class="fine">架空店舗の採用ページです。応募情報の送信は行いません。</p></section>`;
const company = `<div class="subpage-heading"><p class="eyebrow">ABOUT THIS WEBSITE</p><h1>サイトについて</h1><p>横浜家系らーめん「腕火屋」</p></div><section class="subpage-info"><h2>デモサイトのご案内</h2><p>このサイトは、架空の本格家系ラーメン店「腕火屋」を題材にしたデモサイトです。</p><dl class="info-list"><div><dt>店名</dt><dd>腕火屋（うでびや / UDEBIYA）</dd></div><div><dt>開業時期</dt><dd>2026年10月（仮設定）</dd></div><div><dt>所在地・電話番号</dt><dd>未設定</dd></div><div><dt>営業時間・定休日</dt><dd>未設定</dd></div><div><dt>運営会社</dt><dd>架空店舗のため未設定</dd></div><div><dt>写真</dt><dd>AI生成のイメージ</dd></div></dl><p>掲載メニュー・価格・駐車場等は仮設定です。予約、お問い合わせ、注文、採用応募は受け付けておりません。個人情報の入力・送信機能はありません。</p></section>`;
await fs.mkdir(out, { recursive: true });
await fs.writeFile(
  path.join(out, "index.html"),
  shell("本格家系を、腕と火で食わせる。", home),
);
for (const [page, title, content] of [
  ["menu", "メニュー", menu],
  ["recruit", "採用情報", recruit],
  ["company", "サイトについて", company],
]) {
  await fs.mkdir(path.join(out, page), { recursive: true });
  await fs.writeFile(
    path.join(out, page, "index.html"),
    shell(
      title,
      `<div class="subpage"><a class="back-link" href="../">← トップへ</a>${content}</div>`,
      page,
    ),
  );
}
await fs.writeFile(path.join(out, ".nojekyll"), "");
console.log("Built 4 UDEBIYA static pages.");

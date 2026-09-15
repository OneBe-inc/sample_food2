# サンプル — TEPPAN DINING

架空の鉄板焼き店「サンプル」の静的ウェブサイト。

## 公開先

https://onebe-inc.github.io/sample_food2/

## 構成

- `public/`：GitHub Pages 公開ファイル
- `build.mjs`：HTML 4ページの生成（トップ・お品書き・採用情報・会社概要）
- `public/assets/site.css`：オリジナルのスタイル
- `public/assets/site.js`：メニュー、ダイアログ、料理タブ、背景写真の切り替え
- `ASSETS.md`：画像の制作・出典情報

HTMLを編集する場合は `build.mjs` を変更し、`node build.mjs` で生成します。CSS・JSは直接編集できます。外部パッケージやビルド依存はありません。

## 公開

GitHub Pages の Source を GitHub Actions に設定。main に push すると `public/` が公開されます。

## デザインについて

参考サイト https://teppanyaki-mitsui.com/ から着想を得た、大きな固定写真と縦長コンテンツの構成です。公開版のHTML・CSS・JavaScript・文章・ロゴは新規制作し、写真は参照画像を与えずAI生成したオリジナル素材です。参考サイトから取得した写真・ロゴ・イラスト・コードは公開版に含めていません。

実店舗の住所・電話番号・予約リンクを掲載せず、予約・問い合わせ・採用ボタンはサンプル案内ダイアログを開きます。掲載価格・営業時間等は架空のサンプルです。検索エンジン向けに noindex を指定しています。

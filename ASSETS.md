# 腕火屋 素材制作記録

2026-09-25。ユーザー提供の承認画像を基準に制作。外部の飲食店サイトから写真・ロゴ・コードを取得していません。

## 提供素材

- `pc-top-approved.png`: ページ構成、世界観、下層写真の参照。
- `pc-hero-photo-revised.png`: PCヒーロー写真・筆文字の正本。
- `sp-hero-approved.png`: SP独自の写真構図と縦組み店名の正本。
- `Codex 画像 2026年9月25日 23_28_10.png`: 作業中に追加提供された特製らーめん写真。`bowl.webp` / `bowl-800.webp` として使用。

元のデザイン画像を公開HTMLの背景として貼っていません。実装写真には文字・ナビ・ボタンがなく、内容や操作はHTML/CSS/JSで分離しています。

## 配信用素材

| ファイル | 出所・用途 |
| --- | --- |
| hero.webp / hero-800.webp | 改訂PC画像を内蔵image_genで編集。文字・UI・看板文字を除去した横長写真 |
| hero-mobile.webp | SP画像を内蔵image_genで編集。文字・UI・駐車場バッジを除去した縦長写真 |
| chef.webp | PC全体案を参照して内蔵image_genで作成した厨房の職人写真 |
| soup.webp | 同、濃厚スープを注ぐおたまの写真 |
| pork.webp | 同、チャーシューを仕込む写真 |
| room.webp | 同、木のカウンターと厨房の写真 |
| exterior.webp | 同、郊外の駐車場付き店舗の写真 |
| bowl.webp | 作業中に追加提供された写真をWebPに最適化 |
| logo.png / logo-vertical.png | 提供画像から店名のみ切り出し、暗い背景を透過。誤生成された赤い印章を除き、HTMLで「横浜／家系」を正しく表示 |
| ude.png / hi.png | 改訂PC画像から赤い「腕」「火」の筆文字のみ透過抽出 |
| ogp.jpg | hero写真から1200×630のSNSカード用画像を作成 |
| favicon.svg | 新規のシンプルな炎のベクターアイコン |

各横長写真の800px版を用意し、srcsetで画面幅に応じて配信。麺セクションはhero写真の麺部分をCSSで拡大配置。画像の周囲はCSSのマスク・グラデーションで背景に接続します。WebP品質82〜85。ヒーローは優先ロード、下層写真はlazy-load、各画像に寸法・代替テキストを指定。

## 内蔵image_genへのプロンプト記録

生成はすべて内蔵ツールを使用。CLI/APIフォールバックは未使用。以下は制作指示の記録です。

1. **PC hero / precise-object-edit**: Approved desktop image as edit target. Only full bleed 16:9 photographic background. Remove all overlaid typography, calligraphy, stamps, navigation, buttons, lines and scroll icons; reconstruct natural dark kitchen. Preserve ramen bowl on right, lifted noodles, nori, spinach, chashu, warm light and steam. Left 43% dark negative space. Remove wooden sign lettering. No UI, text or fire.
2. **Chef / photorealistic-natural**: Approved full page as reference. One wide 16:9 photo matching second section; chef from behind at work in steaming kitchen, black shirt and cap with no lettering, chef in right half, left half dark. Nearly monochrome warm documentary photograph. No excessive steam, flames, logo, text or UI.
3. **Soup / photorealistic-natural**: Approved full page as reference. Wide photo of black ladle at upper right pouring thick creamy beige pork bone soy broth into dark stockpot. Natural steam, warm subdued lighting. Left 45% dark. No text, logo, UI or collage.
4. **Pork / photorealistic-natural**: Approved full page as reference. Wide photo of sliced rolled chashu on dark wood at right, hand and knife at far right, spinach and nori blurred behind. Restrained highlights and visible meat fibers. Left 42% dark. No text, logo or UI.
5. **Room / photorealistic-natural**: Approved full page as reference. Wide photo of rustic ramen counter, dark wood, stools, stainless pots, amber pendant lights. Left third dark for HTML. No people, lettering, signage, logo or UI.
6. **Exterior / photorealistic-natural**: Approved full page as reference. Standalone suburban ramen shop at blue hour, dark timber, amber windows, blank wood sign; parking spaces with white lines in foreground. Building left and center, trees at far right. No people, cars, text, logo or UI.
7. **Mobile hero / precise-object-edit**: Approved SP image as edit target. Clean vertical 9:16 photo. Remove lettering, stamps, header, buttons, menu, opening date, parking badge and UI. Preserve blurred chef at upper center, bowl across lower two thirds, lifted noodles at right. Keep left dark for vertical HTML. Remove chef shirt lettering. No new text or logo.
8. **Bowl / photorealistic-natural**: Approved full page as reference. Square photo of whole black ramen bowl, creamy pork bone soy broth, chashu, spinach, three nori sheets and two marinated egg halves. Three-quarter view from above, nearly black background, subtle steam, warm lighting. No chopsticks, text, logo or UI. Subsequently the user's additional bowl file was used as the delivery source.

## 変更前の素材

旧鉄板焼きサイトの本文写真と、今回未使用となった旧SNS広告画像を公開フォルダから削除。以前の素材・制作記録はGit履歴に保存されています。今回のOGPは腕火屋の料理写真です。

## 確認範囲

各素材と実装画面を目視し、写真へのUI・文字混入を避けています。提供画像の利用依頼に基づいた制作記録であり、第三者権利の網羅的な調査ではありません。

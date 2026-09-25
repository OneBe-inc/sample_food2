# 腕火屋のアクセス解析

## 接続先

- アカウント: 株式会社OneBe（386801683）
- プロパティ: DEMO_food2（555918639）
- Webストリーム: DEMO_food2 Web（15846456641）
- 測定ID: G-GZR3S41JM0
- 対象URL: https://onebe-inc.github.io/sample_food2/
- 管理画面: https://analytics.google.com/analytics/web/#/a386801683p555918639/reports/intelligenthome

基本設定はDEMO_food1に合わせ、日本・日本時間・日本円、業種「ビジネス、産業」、規模「1～10名」、目標「見込み顧客の発掘」「ウェブ / アプリのトラフィックの分析」です。DEMO_food1の設定は変更していません。

`analytics.config.json` のIDを全4ページのメタ情報に出力し、共通の `analytics.js` から非同期でGoogleタグを読み込みます。対象の公開オリジン・パスでのみ動き、ローカル表示や別ドメインのプレビューでは送信しません。IDを空にして再ビルドすると計測を停止できます。

## 計測内容

| イベント          | 内容                                                       | 主なパラメータ          |
| ----------------- | ---------------------------------------------------------- | ----------------------- |
| page_view         | ページを読み込んだ回数。gtagのconfigから1回送信            | ページURL・タイトル     |
| menu_view         | メニューページの閲覧                                       | site_name               |
| navigation_click  | サイト内リンクのクリック                                   | destination, placement  |
| contact_open      | 予約・問い合わせのデモ案内を開く                           | placement, is_demo=true |
| store_info_open   | 店舗案内を開く                                             | placement, is_demo=true |
| recruit_info_open | 採用案内を開く                                             | placement, is_demo=true |
| news_open         | 開業のお知らせを開く                                       | placement, is_demo=true |
| scroll_depth      | スクロール可能距離の25・50・75・90%を通過、各ページ1回ずつ | percent_scrolled        |

`placement` は header / footer / mobile_navigation / content。スクロールはページ読了の近似で、本文を読んだことを保証しません。予約・注文・応募は受け付けないデモなので、案内ボタンのクリックを実際の成約やキーイベントとして設定していません。

ストリームの拡張計測はページ読込・離脱クリック・動画・ダウンロードを有効化。履歴変更によるページビュー、標準スクロール、サイト内検索、フォーム操作は無効化しています。ページ内リンクの重複ページビューとデモの閉じるフォームの誤計測を防ぎ、スクロールは独自イベントに統一しています。

Googleシグナル・広告向けパーソナライズはタグで無効化。ページURLと参照URLからクエリ・フラグメントを除外するため、UTMキャンペーン別の集計には現在対応していません。Cookieは `udebiya` プレフィックス、対象サイトのパスで設定します。アクセス解析の説明を「サイトについて」に掲載しています。

## 確認と分析

リアルタイムで閲覧・イベントの受信を確認し、データ蓄積後はトラフィック獲得で流入元、ページとスクリーンで各ページの閲覧数、イベントでメニュー・店舗案内の関心を確認します。新規プロパティのため設置以前のアクセスは遡って取得できません。確認用のアクセスが含まれるので初期の数値を一般訪問者の傾向と扱わないでください。

イベント名は標準レポートで集計できます。独自パラメータを探索・通常レポートの軸として使用する場合は、必要なパラメータをGA4のカスタム定義に登録してください。ブラウザのブロック機能やCookie制限等により、全訪問を計測できるとは限りません。

## 検証方法

`npm test` はGoogleへの通信を模擬して、測定ID・ページビューの重複防止・URL除外・案内操作・スクロールの重複防止・計測無効時の動作を検証します。テストから実際のGA4には送信しません。本番への表示検証はGoogleタグをブロックし、別途1つの確認セッションで受信を確認します。

実装参照: https://developers.google.com/analytics/devguides/collection/ga4/views および https://developers.google.com/analytics/devguides/collection/ga4/reference/config

# すみだAI教室（AIプロジェクトチーム）

墨田区発、**シニア（高齢者）向けのオンライン＆出張AI教室**の立ち上げ企画・公式サイト一式です。
運営ブランドは **AIプロジェクトチーム**。

## サイト構成（SEO対応・複数ページ）

| ファイル | ページ | ねらい（SEO） |
|----------|--------|----------------|
| `index.html` | トップ | 「シニア AI教室 オンライン」「墨田区 スマホ教室」 |
| `courses.html` | コース・料金 | 講座名・料金系キーワード（Course構造化データ入り） |
| `family.html` | ご家族の方へ | 「親 スマホ教室」「高齢の親 詐欺対策」など子世代向け |
| `online.html` | オンラインのはじめ方 | 「シニア オンライン講座 やり方」（HowTo構造化データ） |
| `faq.html` | よくある質問 | FAQPage構造化データでリッチリザルト狙い |
| `about.html` | 会社概要 | 運営者情報（E-E-A-T） |
| `contact.html` | お問い合わせ | 体験申込・代理申込の受け皿 |
| `blog/` | ブログ（記事一覧＋記事3本） | 「詐欺メール 見分け方」「ChatGPT 始め方 シニア」等の検索流入（Article構造化データ） |
| `sitemap.xml` / `robots.txt` | — | クローラー向け |
| `assets/` | CSS・JS・OGP画像 | 共通デザインシステム |
| `404.html` | エラーページ | — |

全ページに canonical / OGP / Twitter Card / JSON-LD（Organization・BreadcrumbList 等）を実装。
デザインはシニア可読性優先（基本19px・UDフォント BIZ UDPGothic・高コントラスト・ダークモード対応）。

## 事業ドキュメント

| ファイル | 説明 |
|----------|------|
| `docs/company-profile.md` | 会社概要・ブランドガイド（理念・バリュー・カラー・タイポ・ロゴ案） |
| `docs/business-plan.md` | 事業計画書（無店舗型：オンライン＋出張モデル） |

## 公開（GitHub Pages）

`.github/workflows/pages.yml` により、**mainブランチへのpushで自動デプロイ**されます。

初回のみ設定が必要です：
1. このブランチを main にマージ
2. リポジトリの **Settings → Pages → Source** を **GitHub Actions** に設定
3. 公開URL: `https://sumida-ai.jp/`

公開後にやること（SEO）：
- [Google Search Console](https://search.google.com/search-console) にサイトを登録し、`sitemap.xml` を送信
- 独自ドメイン取得時は、全ページの canonical / OGP / sitemap のURLを差し替え

## フォーム・LINEの本番化

`assets/config.js` にURLを貼るだけで有効になります（コードの知識は不要）:
- **お問い合わせフォーム** → Googleフォーム連携。手順: [`docs/form-setup.md`](docs/form-setup.md)
- **LINE友だち追加ボタン** → LINE公式アカウント連携。手順: [`docs/line-setup.md`](docs/line-setup.md)

## ⚠️ ご注意

電話番号・メール・料金などは、すべて**仮（プレースホルダー）**です。
実開業時に、正しい情報・本番用の申込フォーム（送信先）へ差し替えてください。
「みんなの声」は開講前のサービスイメージ（サンプル）であり、サイト上にもその旨を明記しています。

## 開発（Astro）

サイトは [Astro](https://astro.build/) で組み立て、静的HTMLとして GitHub Pages に公開しています。
ページに JavaScript は出さない設定なので、表示の速さは静的HTMLのときと同じです。

```bash
npm ci            # 初回だけ
npm run dev       # 手元で確認（http://localhost:4321）
npm run check     # 型チェック
npm run build     # dist/ に公開用のHTMLを書き出す
```

| 置き場所 | 中身 |
|---|---|
| `src/site.ts` | 電話番号・ナビ・ページ下部の注記など、全ページ共通の事実 |
| `src/layouts/Base.astro` | head・ヘッダー・申し込みボタン・フッター |
| `src/pages/` | 各ページのメタ情報（title・description・構造化データ） |
| `src/bodies/` | 各ページの本文（HTML） |
| `public/` | 画像・CSS・JS・robots.txt・sitemap.xml など、そのまま公開するもの |

`main` に反映されると GitHub Actions が型チェックとビルドを行い、通ったときだけ公開します。
PR ではビルドの確認だけ行います。

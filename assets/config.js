/* ============================================================
   すみだAIきょうしつ — サイト設定ファイル
   ここにURLを貼るだけで、フォーム送信とLINEボタンが有効になります。
   くわしい手順: docs/form-setup.md ・ docs/line-setup.md
   ============================================================ */
window.SITE_CONFIG = {

  /* --- お問い合わせフォーム（Googleフォーム連携） ---
     1) Googleフォームを作成（質問6つ・すべて「記述式」または「プルダウン」）
     2) フォームのURLの formResponse 版を下に貼る
        例: "https://docs.google.com/forms/d/e/1FAIpQLSe.../formResponse"
     3) 各質問の entry ID を下に貼る（取得方法は docs/form-setup.md）
     空文字 "" のままなら、フォームはデモ表示のまま動きます。 */
  GOOGLE_FORM_ACTION: "",
  GOOGLE_FORM_ENTRIES: {
    who:    "entry.000000001",  /* どなたのお申し込みか */
    name:   "entry.000000002",  /* お名前 */
    tel:    "entry.000000003",  /* お電話番号 */
    course: "entry.000000004",  /* ご希望のコース */
    mode:   "entry.000000005",  /* ご希望の受け方 */
    msg:    "entry.000000006"   /* ご相談内容 */
  },

  /* --- LINE公式アカウント ---
     LINE公式アカウントの「友だち追加URL」を貼ると、
     お問い合わせページにLINEボタンが表示されます。
     例: "https://lin.ee/xxxxxxx" */
  LINE_URL: ""

};

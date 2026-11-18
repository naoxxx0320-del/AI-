/**
 * サイト全体で使う事実と設定。
 * 電話番号・ナビゲーション・注記はここだけを直せば全ページに反映される。
 */
export const SITE = {
  name: 'すみだAI教室',
  operator: 'AIプロジェクトチーム',
  url: 'https://sumida-ai.jp',
  tel: '08048855430',
  telDisplay: '080-4885-5430',
  /** ページ下部の注記。開講状況が変わったらここを直す */
  notice: '料金はすべて税込です。お申し込みの際に、金額と内容を必ず先にお伝えします。',
  googleVerification: [
    '2-ufqwHqM7YkhghOjfoz0OS3kuHQ7gcrI-Gbu63--30',
    'exQdm5sAERYM9CTM8nw4zn4RQOzJbqzZEYvfNjPhWlM',
  ],
  /** キャッシュを更新したいときに上げる */
  assetVersion: { css: '20261118a', js: '20261118a' },
} as const;

export type NavItem = { href: string; label: string; mobileOnly?: boolean };

export const NAV: NavItem[] = [
  { href: '/', label: 'ホーム', mobileOnly: true },
  { href: '/courses.html', label: 'コース・料金' },
  { href: '/sumida.html', label: '墨田区の方へ' },
  { href: '/teacher.html', label: '講師紹介' },
  { href: '/family.html', label: 'ご家族の方へ', mobileOnly: true },
  { href: '/online.html', label: 'オンラインのはじめ方', mobileOnly: true },
  { href: '/faq.html', label: 'よくある質問' },
  { href: '/blog/', label: 'ブログ' },
];

export const FOOT_MENU: NavItem[] = [
  { href: '/courses.html', label: 'コース・料金' },
  { href: '/sumida.html', label: '墨田区の方へ' },
  { href: '/teacher.html', label: '講師紹介' },
  { href: '/online.html', label: 'オンラインのはじめ方' },
  { href: '/family.html', label: 'ご家族の方へ' },
  { href: '/faq.html', label: 'よくある質問' },
  { href: '/blog/', label: 'ブログ' },
];

export const FOOT_ABOUT: NavItem[] = [
  { href: '/about.html', label: '会社概要' },
  { href: '/contact.html', label: 'お問い合わせ・お申し込み' },
  { href: '/contact.html#privacy', label: '個人情報の取り扱い' },
];

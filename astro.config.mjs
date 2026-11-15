// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sumida-ai.jp',
  // 既存URL（about.html, blog/index.html など）をそのまま保つ
  build: { format: 'preserve' },
  // 既定ではページに JavaScript を出さない。必要な部品だけ後から足せる
});

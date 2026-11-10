import { defineConfig } from 'vite';
import { resolve } from 'path';

/* ─────────────────────────────────────────────────────────────
 * BAKIM MODU
 * true  → canlı sitede ana sayfa, editör, giriş ve panel /bakim/ sayfasına yönlenir.
 *         Davetiyeler (/elcintalha/, /kapi/) normal çalışmaya devam eder.
 * false → site normal açılır.
 * Barındırma panelinden ortam değişkeniyle de değiştirilebilir: BAKIM_MODU=false
 *
 * Bakımdayken siteyi kendiniz görmek için:  birhaberimizvar.com/?bakim=kapat
 * (bu tarayıcıda hatırlanır; geri açmak için ?bakim=ac)
 * Yerelde (npm run dev) bakım ekranı hiç çıkmaz.
 * ───────────────────────────────────────────────────────────── */
const BAKIM_MODU = process.env.BAKIM_MODU ? process.env.BAKIM_MODU === 'true' : true;

// Bakımda gizlenecek sayfalar
const BAKIMDA_GIZLI = ['/index.html', '/editor/index.html', '/giris/index.html', '/panel/index.html'];

const bakimScript = `<script>
(function () {
  try {
    var q = new URLSearchParams(location.search).get('bakim');
    if (q === 'kapat') localStorage.setItem('bakim-gec', '1');
    if (q === 'ac') localStorage.removeItem('bakim-gec');
    if (localStorage.getItem('bakim-gec') === '1') return;
  } catch (e) {}
  location.replace('/bakim/');
})();
</script>`;

function bakimModu() {
  return {
    name: 'bakim-modu',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      if (!BAKIM_MODU || !BAKIMDA_GIZLI.includes(ctx.path)) return html;
      // Sayfa hiç görünmeden yönlensin diye <head>'in en başına
      return html.replace(/<head>/i, `<head>\n${bakimScript}`);
    }
  };
}

export default defineConfig({
  plugins: [bakimModu()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        elcintalha: resolve(__dirname, 'elcintalha/index.html'),
        kapi: resolve(__dirname, 'kapi/index.html'),
        giris: resolve(__dirname, 'giris/index.html'),
        panel: resolve(__dirname, 'panel/index.html'),
        editor: resolve(__dirname, 'editor/index.html'),
        bakim: resolve(__dirname, 'bakim/index.html'),
      },
    },
  },
});

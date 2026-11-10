import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

/* ─────────────────────────────────────────────────────────────
 * BAKIM MODU
 * true  → canlı sitede ana sayfa "Harika bir şey hazırlıyoruz" sayfasını gösterir
 *         (yönlendirme yok; Google ana sayfayı bu başlık/açıklamayla görür).
 *         Editör, giriş ve panel ana sayfaya yönlenir.
 *         Davetiyeler (/elcintalha/, /kapi/) normal çalışmaya devam eder.
 * false → site normal açılır.
 * Barındırma panelinden ortam değişkeniyle de değiştirilebilir: BAKIM_MODU=false
 *
 * Bakımdayken editör/giriş/paneli kendiniz görmek için: /editor/?bakim=kapat
 * (bu tarayıcıda hatırlanır; geri açmak için ?bakim=ac).
 * Yeni ana sayfayı görmek için yerelde: npm run dev (yerelde bakım ekranı çıkmaz).
 * ───────────────────────────────────────────────────────────── */
const BAKIM_MODU = process.env.BAKIM_MODU ? process.env.BAKIM_MODU === 'true' : true;

// Bakımda ana sayfaya yönlenecek sayfalar
const BAKIMDA_GIZLI = ['/editor/index.html', '/giris/index.html', '/panel/index.html'];

const bakimScript = `<script>
(function () {
  try {
    var q = new URLSearchParams(location.search).get('bakim');
    if (q === 'kapat') localStorage.setItem('bakim-gec', '1');
    if (q === 'ac') localStorage.removeItem('bakim-gec');
    if (localStorage.getItem('bakim-gec') === '1') return;
  } catch (e) {}
  location.replace('/');
})();
</script>`;

function bakimModu() {
  return {
    name: 'bakim-modu',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre', // varlıklar (css, görseller) bundan sonra işlensin
      handler(html, ctx) {
        if (!BAKIM_MODU) return html;
        // Ana sayfanın yerine bakım sayfasının içeriği
        if (ctx.path === '/index.html') return readFileSync(resolve(__dirname, 'bakim/index.html'), 'utf-8');
        if (BAKIMDA_GIZLI.includes(ctx.path)) return html.replace(/<head>/i, `<head>\n${bakimScript}`);
        return html;
      }
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
      },
    },
  },
});

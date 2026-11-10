// Kapı şablonunun verisi nereden gelir?
//   /kapi/?preview=1   → editörün önizleme taslağı (localStorage)
//   /kapi/?d=slug      → veritabanındaki davetiye (yayında olan ya da sahibinin taslağı)
//   /kapi/             → event-config.js (demo)
//
// Editörden gelen veri kullanıcı yazısıdır: burada temizlenip şablonun beklediği biçime çevrilir.

import { invitation as demo } from './event-config.js';
import { PREVIEW_KEY } from './invitation-source-keys.js';

export { PREVIEW_KEY };

const params = new URLSearchParams(location.search);
export const isPreview = params.has('preview');
export const previewOpen = isPreview && params.get('open') === '1';
// Bölüm sırası ya da adı: 0, 1… veya invite, countdown, locations, reminder, rsvp, contact
export const previewSlide = isPreview ? params.get('slide') || '' : '';
export const slug = params.get('d') || '';

const str = (v, max = 400) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const escHtml = (v) => String(v).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const nl2br = (v) => escHtml(v).replace(/\r?\n/g, '<br>');

// "0532 123 45 67" → "905321234567"
export function normalizePhone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = `90${d.slice(1)}`;
  if (d.length === 10 && d.startsWith('5')) d = `90${d}`;
  return d.slice(0, 15);
}

// Editör "2027-08-22T17:30" saklar → Türkiye saatiyle ISO
export const toIso = (local) => (local ? `${local.length === 16 ? `${local}:00` : local}+03:00` : '');

export function formatDate(local, lang = 'tr-TR') {
  if (!local) return '';
  const [y, m, d] = local.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

// Editör verisi → event-config biçimi
export function normalize(raw = {}) {
  const names = (Array.isArray(raw.names) ? raw.names : []).map((n) => str(n, 40)).filter(Boolean).slice(0, 2);

  const events = (Array.isArray(raw.events) ? raw.events : []).slice(0, 4).map((e) => {
    const start = str(e.start, 25);
    const place = str(e.place, 80);
    const city = str(e.city, 80);
    return {
      label: str(e.label, 30).toLocaleUpperCase('tr-TR'),
      date: formatDate(start),
      time: start.slice(11, 16),
      place,
      hall: str(e.hall, 60),
      city,
      start: toIso(start),
      maps: str(e.maps, 160) || [place, city].filter(Boolean).join(' ')
    };
  }).filter((e) => e.start);

  const reminderText = str(raw.reminder?.text, 400);
  const labels = {};
  if (str(raw.rsvpYes, 40)) labels.rsvpYes = str(raw.rsvpYes, 40);
  if (str(raw.rsvpNo, 40)) labels.rsvpNo = str(raw.rsvpNo, 40);

  return {
    theme: 'sakayik',
    eyebrow: str(raw.eyebrow, 40) || 'DAVETLİSİNİZ',
    names: names.length ? names : ['İsim'],
    monogram: str(raw.monogram, 8),
    message: str(raw.message, 300),
    events,
    finished: [],
    reminder: reminderText ? { title: str(raw.reminder?.title, 60) || 'Hatırlatma', text: nl2br(reminderText) } : null,
    contacts: (Array.isArray(raw.contacts) ? raw.contacts : [])
      .map((p) => ({ name: str(p.name, 40), phone: normalizePhone(p.phone) }))
      .filter((p) => p.name && p.phone.length >= 10)
      .slice(0, 4),
    songSuccess: str(raw.songSuccess, 160) || 'Bu şarkıyı çalmak için sabırsızlanıyoruz. ♫',
    labels: { ...demo.labels, ...labels }
  };
}

function notFound() {
  document.title = 'Davetiye bulunamadı';
  document.body.innerHTML = `
    <main style="min-height:100dvh;display:grid;place-items:center;padding:24px;text-align:center;font-family:system-ui,sans-serif;background:#f3e9da;color:#5a4230">
      <div>
        <p style="font-size:2rem;margin:0 0 8px">✉︎</p>
        <h1 style="font-size:1.4rem;margin:0 0 8px">Davetiye bulunamadı</h1>
        <p style="margin:0 0 20px;opacity:.8">Bağlantı hatalı olabilir ya da davetiye henüz yayında değil.</p>
        <a href="/" style="color:#a8814f">Bir Haberimiz Var</a>
      </div>
    </main>`;
}

async function load() {
  if (isPreview) {
    try {
      const raw = localStorage.getItem(PREVIEW_KEY);
      if (raw) return { ...normalize(JSON.parse(raw)), id: null };
    } catch { /* bozuk taslak: demo göster */ }
    return { ...demo, id: null };
  }

  if (slug) {
    const { supabase } = await import('./supabase.js');
    const { data, error } = await supabase
      .from('davetiyeler')
      .select('id, data')
      .eq('slug', slug)
      .maybeSingle();
    if (error || !data) return null;
    return { ...normalize(data.data), id: data.id };
  }

  return { ...demo, id: null };
}

const loaded = await load();
if (!loaded) {
  notFound();
  // Şablon hiç çalışmasın
  await new Promise(() => {});
}

export const c = loaded;

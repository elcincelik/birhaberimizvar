import './css/kapi.css';
import gsap from 'gsap';
import {
  createIcons, Phone, MessageCircle, BookOpen, Music2, Feather, Navigation, Heart, HeartCrack, MailCheck, Send
} from 'lucide';
import { c, slug, isPreview, previewOpen, previewSlide, normalize } from './invitation-source.js';
import { mapsLink } from './calendar.js';
import { buildOverlays, setupOverlays } from './kapi-forms.js';
import weddingSong from './assets/audio/weddingsong.mp3';

/* =========================================================
   TEMALAR
   Yeni tasarım = THEMES'e yeni bir blok. CSS'e dokunmaya gerek yok.

   Görseller: src/assets/themes/<tema-adı>/ klasörüne konur, burada yalnızca dosya adı yazılır.
     door / arch          → dikey (telefon) kapı ve kemer görseli
     doorWide / archWide  → yatay (masaüstü) kapı ve kemer görseli
     seal                 → mühür görseli (yazılmazsa CSS ile çizilen mühür + monogram)
   Konum/ölçü değerleri yüzde (%) cinsindendir; açıklamalar şakayık bloğunda.
   Bir temada yazılmayan her değer şakayık'tan (DEFAULT_THEME) alınır.
   ========================================================= */
const DEFAULT_THEME = 'sakayik';

const THEMES = {
  sakayik: {
    images: {
      door: 'door-mobile.jpg',
      arch: 'arch-mobile.jpg',
      doorWide: 'door-desktop.jpg',
      archWide: 'arch-desktop.jpg',
      seal: 'seal.png'
    },
    // Görsellerin en/boy oranı (genişlik / yükseklik)
    imageRatio: 944 / 1680,
    imageRatioWide: 1680 / 944,

    colors: { ink: '#5a4230', accent: '#a8814f', muted: '#8b735c', cream: '#f3e9da' },
    fonts: {
      heading: 'Cormorant Garamond',
      body: 'Poppins',
      // Google Fonts'tan istenen kalınlıklar (font bunları desteklemeli)
      headingAxes: 'wght@400;500;600',
      bodyAxes: 'wght@300;400;500'
    },

    // Yazı alanı — dikey görselin %'si olarak kenarlardan uzaklık
    content: { top: 15, bottom: 21, left: 12, right: 12 },
    // Yazı alanı (masaüstü) — top/bottom: ekranın %'si, width: telefon genişliğinin %'si (ortalı)
    contentWide: { top: 15, bottom: 7, width: 80 },

    // Genel yazı ölçeği (1 = şu anki boyutlar)
    textScale: 1,
    textScaleWide: 1,

    // Mühür: size = telefon genişliğinin %'si, max = px, x/y = görseldeki merkez (%)
    seal: { size: 24, sizeWide: 24, max: 135, x: 50, y: 50, xWide: 50, yWide: 48.25 },

    // Masaüstü kapı görselinde açılan kapının dikdörtgeni (%) — kanatlar buraya oturur.
    // seam = iki kanadın birleştiği çizgi (yazılmazsa tam orta: x + w/2)
    doorWide: { x: 29.35, y: 3.18, w: 41.2, h: 90.15, seam: 49.94 },

    // Alt ok butonunun alttan uzaklığı (CSS uzunluğu)
    navBottom: '1.6cqh'
  },

  // Görselleri hazır olunca kendi klasörlerine konacak. Diğer değerler şimdilik şakayık ile aynı.
  // (Eski renkleri: zeytin ink #4f4632 · accent #8f8457 · cream #efe7d6)
  zeytin: {
    images: {
      door: 'door-mobile.jpg',
      arch: 'arch-mobile.jpg',
      doorWide: 'door-desktop.jpg',
      archWide: 'arch-desktop.jpg',
      seal: 'seal.png'
    }
  },

  // (Eski renkleri: lale ink #5b3f2b · accent #ad8248 · cream #f2e6d2)
  lale: {
    images: {
      door: 'door-mobile.jpg',
      arch: 'arch-mobile.jpg',
      doorWide: 'door-desktop.jpg',
      archWide: 'arch-desktop.jpg',
      seal: 'seal.png'
    }
  }
};

/* ---------- Temayı çöz ---------- */
// Tema klasörlerindeki bütün görseller (Vite derlerken adlarını hash'ler)
const THEME_FILES = import.meta.glob('./assets/themes/*/*.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default'
});
const themeFile = (id, name) => (name ? THEME_FILES[`./assets/themes/${id}/${name}`] : undefined);

function mergeTheme(base, over) {
  const out = { ...base };
  for (const [key, value] of Object.entries(over || {})) {
    out[key] = value && typeof value === 'object' && !Array.isArray(value) ? { ...base[key], ...value } : value;
  }
  return out;
}

const themeId = THEMES[c.theme] ? c.theme : DEFAULT_THEME;
if (!THEMES[c.theme]) console.warn(`"${c.theme}" teması yok, ${DEFAULT_THEME} kullanılıyor.`);
const theme = mergeTheme(THEMES[DEFAULT_THEME], THEMES[themeId]);

// Görsel yolları: temada yoksa şakayık görseline düş (mühür hariç: o zaman çizilen mühür)
const img = {};
for (const key of ['door', 'arch', 'doorWide', 'archWide', 'seal']) {
  img[key] = themeFile(themeId, theme.images[key]);
  if (!img[key] && key !== 'seal') {
    console.warn(`${themeId}: ${theme.images[key]} bulunamadı, ${DEFAULT_THEME} görseli kullanılıyor.`);
    img[key] = themeFile(DEFAULT_THEME, THEMES[DEFAULT_THEME].images[key]);
  }
}

/* ---------- Tema değerlerini CSS değişkenlerine yaz ---------- */
const rootStyle = document.documentElement.style;
const cssVars = {
  '--ink': theme.colors.ink,
  '--accent': theme.colors.accent,
  '--muted': theme.colors.muted,
  '--cream': theme.colors.cream,
  '--font-heading': `'${theme.fonts.heading}', serif`,
  '--font-body': `'${theme.fonts.body}', sans-serif`,
  '--door-m': `url('${img.door}')`,
  '--arch-m': `url('${img.arch}')`,
  '--door-d': `url('${img.doorWide}')`,
  '--arch-d': `url('${img.archWide}')`,
  '--img-ratio': theme.imageRatio,
  '--img-ratio-wide': theme.imageRatioWide,
  '--content-top': theme.content.top,
  '--content-bottom': theme.content.bottom,
  '--content-left': theme.content.left,
  '--content-right': theme.content.right,
  '--content-top-wide': theme.contentWide.top,
  '--content-bottom-wide': theme.contentWide.bottom,
  '--content-width-wide': theme.contentWide.width,
  '--text-scale': theme.textScale,
  '--text-scale-wide': theme.textScaleWide,
  '--seal-size': theme.seal.size,
  '--seal-size-wide': theme.seal.sizeWide,
  '--seal-max': theme.seal.max,
  '--seal-x': theme.seal.x,
  '--seal-y': theme.seal.y,
  '--seal-x-wide': theme.seal.xWide,
  '--seal-y-wide': theme.seal.yWide,
  '--door-x-wide': theme.doorWide.x,
  '--door-y-wide': theme.doorWide.y,
  '--door-w-wide': theme.doorWide.w,
  '--door-h-wide': theme.doorWide.h,
  '--door-seam-wide': theme.doorWide.seam ?? theme.doorWide.x + theme.doorWide.w / 2,
  '--nav-bottom': theme.navBottom
};
for (const [name, value] of Object.entries(cssVars)) rootStyle.setProperty(name, String(value));

/* ---------- Tema fontlarını yükle ---------- */
{
  const family = (name, axes) => `family=${encodeURIComponent(name).replace(/%20/g, '+')}${axes ? `:${axes}` : ''}`;
  const families = [family(theme.fonts.heading, theme.fonts.headingAxes)];
  if (theme.fonts.body !== theme.fonts.heading) families.push(family(theme.fonts.body, theme.fonts.bodyAxes));
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
  document.head.appendChild(link);
}

/* ---------- Metinler (event-config.js → labels, yoksa bunlar) ---------- */
const BASE_LABELS = {
  tapSeal: 'MÜHÜRE DOKUNUN',
  loading: 'Davetiyeniz hazırlanıyor...',
  locationTitle: 'Lokasyon',
  directions: 'Yol Tarifi Al',
  days: 'GÜN',
  hours: 'SAAT',
  minutes: 'DK',
  seconds: 'SN',
  today: 'Bugün o gün!',
  contactTitle: 'İLETİŞİM',
  contactPerson: 'İLETİŞİM KİŞİSİ',
  guestbook: 'Anı Defteri',
  guestbookHint: 'Güzel dileklerini bırak',
  songRequest: 'Şarkı İsteği',
  songRequestHint: 'Bizim için bir şarkı iste',
  madeWith: 'ile hazırlandı',
  rsvpEyebrow: 'LCV',
  rsvpTitle: 'Katılım durumunuz?',
  rsvpYes: 'Orada olacağım!',
  rsvpNo: 'Gelemiyorum :(',
  rsvpFormTitle: 'Katılım Durumu',
  rsvpFormText: 'Yanıtınız bizim için çok değerli.',
  rsvpName: 'İsminiz',
  rsvpNamePlaceholder: 'Adınızı ve soyadınızı yazın',
  rsvpGuests: 'Kaç kişi geleceksiniz? (siz dahil)',
  rsvpNote: 'Notunuz',
  rsvpNotePlaceholder: 'Bize iletmek istediğiniz bir not varsa...',
  rsvpSubmit: 'Yanıtı Gönder',
  rsvpThanksYes: 'Harika, {name}!',
  rsvpThanksYesText: 'Sizi aramızda görmek için sabırsızlanıyoruz.',
  rsvpThanksNo: 'Teşekkürler, {name}.',
  rsvpThanksNoText: 'Sizi özleyeceğiz, kalbimiz sizinle.',
  rsvpChange: 'Yanıtımı değiştir',
};
const labelsFor = (cfg) => ({ ...BASE_LABELS, ...(cfg.labels || {}) });
let L = labelsFor(c);

// kapi.css'teki masaüstü @media ile aynı olmalı
const desktopMQ = window.matchMedia('(min-width: 900px) and (min-aspect-ratio: 5/4)');

/* Büyük ekranlarda yazı üst sınırlarını büyüt (810px yükseklikteki laptop = 1) */
function updateScale() {
  const { innerWidth: w, innerHeight: h } = window;
  // Masaüstü: 810px yükseklik = 1 · Mobil/tablet: 480px genişlik = 1 (telefonlarda hep 1)
  const k = desktopMQ.matches
    ? Math.max(1, (h * 0.74) / 600)
    : Math.max(1, Math.min(w, h * 0.5625) / 480);
  rootStyle.setProperty('--k', k.toFixed(3));
}
updateScale();
window.addEventListener('resize', updateScale, { passive: true });
desktopMQ.addEventListener('change', updateScale);

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const esc = (v = '') =>
  String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const rule = (mark = '✦') => `<div class="rule" aria-hidden="true"><span></span>${mark}<span></span></div>`;
const heart = '<p class="heart-sep" aria-hidden="true">♥</p>';
let names = (c.names || []).filter(Boolean);
let isSingle = names.length < 2;

/* ---------- Bölümler (ana davetiyedeki sırayla) ---------- */
// Editör önizlemesi veriyi canlı değiştirebilsin diye fonksiyon içinde
function buildSlides(c) {

// 1) Davetiye
const inviteEvents = c.events
  .map(
    (e) => `
    <div class="inv-event">
      <p class="label">${esc(e.label)}</p>
      <p class="inv-date">${esc(e.date)}</p>
      <p class="inv-meta">${esc(e.time)}<br>${esc(e.place)}</p>
    </div>`
  )
  .join('<span class="inv-sep" aria-hidden="true">♥</span>');

const inviteSlide = `
  <p class="eyebrow">${esc(c.eyebrow)}</p>
  <h1 class="names">${names.map((n) => `<span>${esc(n)}</span>`).join('<i>&amp;</i>')}</h1>
  ${rule()}
  <p class="message">${esc(c.message)}</p>
  <div class="inv-events">${inviteEvents}</div>`;

// 2) Geri sayım
const countdownSlide = c.events
  .map(
    (e, i) => `
    <div class="cd-block">
      <h3 class="label">${esc(e.label)}</h3>
      <p class="cd-date">${esc(e.date)}</p>
      <div class="countdown" data-event="${i}">
        <div class="unit"><b data-u="d">00</b><small>${esc(L.days)}</small></div>
        <div class="unit"><b data-u="h">00</b><small>${esc(L.hours)}</small></div>
        <div class="unit"><b data-u="m">00</b><small>${esc(L.minutes)}</small></div>
        <div class="unit"><b data-u="s">00</b><small>${esc(L.seconds)}</small></div>
      </div>
    </div>`
  )
  .join(heart);

// 3) Lokasyon
const mapEmbed = (q) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
const locationSlide = `
  <h2 class="title">${esc(L.locationTitle)}</h2>
  ${c.events
    .map(
      (e) => `
      <article class="loc">
        <p class="label">${esc(e.label)}</p>
        <h3>${esc(e.place)}</h3>
        <p class="loc-meta">${[e.hall, e.time, e.city].filter(Boolean).map(esc).join(' · ')}</p>
        <div class="map">
          <iframe src="${esc(mapEmbed(e.maps || e.place))}" loading="lazy" tabindex="-1"
            referrerpolicy="no-referrer-when-downgrade" title="${esc(e.place)} haritası"></iframe>
          <a class="map-go" href="${esc(mapsLink(e.maps || e.place))}" target="_blank" rel="noopener noreferrer">
            <i data-lucide="navigation"></i>${esc(L.directions)}
          </a>
        </div>
      </article>`
    )
    .join(heart)}`;

// 4) Hatırlatma
const reminderSlide = c.reminder
  ? `
  <h2 class="title">${esc(c.reminder.title)}</h2>
  ${rule('♥')}
  <p class="message">${c.reminder.text}</p>`
  : '';

// 5) LCV — katılım durumu
const rsvpSlide = `
  <p class="eyebrow">${esc(L.rsvpEyebrow)}</p>
  <h2 class="title">${esc(L.rsvpTitle)}</h2>
  ${rule('♥')}
  <div class="rsvp-choices" id="rsvpChoices">
    <button type="button" class="extra rsvp-choice" data-attending="yes">
      <span class="extra-icon"><i data-lucide="heart"></i></span>
      <span class="extra-text"><strong>${esc(L.rsvpYes)}</strong></span>
    </button>
    <button type="button" class="extra rsvp-choice is-no" data-attending="no">
      <span class="extra-icon"><i data-lucide="heart-crack"></i></span>
      <span class="extra-text"><strong>${esc(L.rsvpNo)}</strong></span>
    </button>
  </div>
  <div class="rsvp-done" id="rsvpDone" hidden>
    <p class="rsvp-done-title" id="rsvpDoneTitle"></p>
    <p class="message" id="rsvpDoneText"></p>
    <button type="button" class="rsvp-change" id="rsvpChange">${esc(L.rsvpChange)}</button>
  </div>`;

// 6) İletişim
const contactSlide = `
  <p class="eyebrow">${esc(L.contactTitle)}</p>
  <div class="contacts">
    ${(c.contacts || [])
      .map(
        (p) => `
        <article class="contact">
          <div>
            <p class="label">${esc(L.contactPerson)}</p>
            <h3>${esc(p.name)}</h3>
          </div>
          <div class="contact-actions">
            <a class="icon-btn" href="tel:+${esc(p.phone)}" aria-label="${esc(p.name)} kişisini ara"><i data-lucide="phone"></i></a>
            <a class="icon-btn" href="https://wa.me/${esc(p.phone)}" target="_blank" rel="noopener noreferrer"
              aria-label="${esc(p.name)} kişisine WhatsApp'tan yaz"><i data-lucide="message-circle"></i></a>
          </div>
        </article>`
      )
      .join('')}
  </div>
  ${rule('♥')}
  <div class="extras">
    <button type="button" class="extra" id="openGuestbook">
      <span class="extra-icon"><i data-lucide="book-open"></i></span>
      <span class="extra-text"><strong>${esc(L.guestbook)}</strong><small>${esc(L.guestbookHint)}</small></span>
    </button>
    <button type="button" class="extra" id="openSongRequest">
      <span class="extra-icon"><i data-lucide="music-2"></i></span>
      <span class="extra-text"><strong>${esc(L.songRequest)}</strong><small>${esc(L.songRequestHint)}</small></span>
    </button>
  </div>
  <p class="made"><a href="/">Bir Haberimiz Var</a> ${esc(L.madeWith)}</p>`;

const slides = [
  { id: 'invite', html: inviteSlide },
  { id: 'countdown', html: countdownSlide },
  { id: 'locations', html: locationSlide },
  { id: 'reminder', html: reminderSlide },
  { id: 'rsvp', html: rsvpSlide },
  { id: 'contact', html: contactSlide }
].filter((s) => s.html);
  return slides;
}
let slides = buildSlides(c);

/* ---------- Sayfa ---------- */
document.querySelector('#app').innerHTML = `
  <div class="loader" id="loader" aria-live="polite">
    <p class="loader-mono">${esc(c.monogram || names.map((n) => n[0]).join(isSingle ? '' : ' & '))}</p>
    <div class="loader-line"><span></span></div>
    <p class="loader-text">${esc(L.loading)}</p>
  </div>

  <div class="backdrop" id="backdrop"></div>

  <main class="stage" aria-label="${esc(names.join(' ve '))} davetiyesi">
    <div class="arch"></div>

    <div class="content">
      ${slides.map((s, i) => `<section class="slide slide-${s.id}" data-i="${i}">${s.html}</section>`).join('')}
    </div>

    <nav class="page-nav" id="nav" aria-label="Sayfa geçişi">
      <button type="button" class="page-nav-btn up" id="prevBtn" aria-label="Önceki sayfa"></button>
      <button type="button" class="page-nav-btn down" id="nextBtn" aria-label="Sonraki sayfa"></button>
    </nav>

    <div class="doors" id="doors">
      <div class="doorway"></div>
      <div class="leaf left"><div class="shade"></div></div>
      <div class="leaf right"><div class="shade"></div></div>
      <button class="seal" id="seal" type="button" aria-label="Mühüre dokun, davetiyeyi aç">
        ${img.seal
          ? `<img src="${img.seal}" alt="" draggable="false" />`
          : `<span class="seal-drawn">${esc(c.monogram || names.map((n) => n[0]).join(isSingle ? '' : ' & '))}</span>`}
      </button>
      <p class="hint" id="hint"><span>${esc(L.tapSeal)}</span></p>
    </div>
  </main>

  ${buildOverlays(c, L)}

  <div class="music" id="music">
    <div class="music-notes" id="musicNotes" aria-hidden="true"></div>
    <button class="music-toggle" id="musicToggle" type="button" aria-label="Müziği çal" aria-pressed="false">♪</button>
    <audio id="bgMusic" src="${weddingSong}" preload="metadata" loop></audio>
  </div>
`;

const drawIcons = () => createIcons({
  icons: { Phone, MessageCircle, BookOpen, Music2, Feather, Navigation, Heart, HeartCrack, MailCheck, Send },
  attrs: { 'stroke-width': 1.7, width: 20, height: 20 }
});
drawIcons();

/* ---------- LCV ---------- */
// Verilen yanıt bu tarayıcıda hatırlanır; sayfa yenilense de teşekkür mesajı görünür
const RSVP_KEY = `rsvp:${location.pathname}${slug ? `:${slug}` : ''}`;

function showRsvpAnswer(answer) {
  const yes = answer.attending;
  const fill = (t) => t.replaceAll('{name}', answer.name.split(' ')[0]);
  document.querySelector('#rsvpDoneTitle').textContent = fill(yes ? L.rsvpThanksYes : L.rsvpThanksNo);
  document.querySelector('#rsvpDoneText').textContent = yes ? L.rsvpThanksYesText : L.rsvpThanksNoText;
  document.querySelector('#rsvpChoices').hidden = true;
  document.querySelector('#rsvpDone').hidden = false;
}

function readRsvp() {
  try { return JSON.parse(localStorage.getItem(RSVP_KEY)) || null; } catch { return null; }
}

const { openRsvp } = setupOverlays({
  preview: isPreview,
  onRsvp: (answer) => {
    if (isPreview) { showRsvpAnswer(answer); return; }
    try { localStorage.setItem(RSVP_KEY, JSON.stringify(answer)); } catch { /* gizli sekme vb. */ }
    showRsvpAnswer(answer);
  }
});

const savedRsvp = isPreview ? null : readRsvp();
if (savedRsvp?.name) showRsvpAnswer(savedRsvp);

// Olay yetkilendirme: önizlemede bölümler yeniden çizilse de çalışır
document.addEventListener('click', (e) => {
  const choice = e.target.closest('#rsvpChoices [data-attending]');
  if (choice) { openRsvp(choice.dataset.attending === 'yes', readRsvp() || {}); return; }
  if (e.target.closest('#rsvpChange')) {
    const prev = readRsvp() || {};
    openRsvp(prev.attending ?? true, prev);
  }
});

/* ---------- Yükleme ekranı ---------- */
function preload(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    img.src = src;
    window.setTimeout(resolve, 8000);
  });
}

{
  const loader = document.querySelector('#loader');
  const bar = loader.querySelector('.loader-line span');
  const tasks = [
    preload(desktopMQ.matches ? img.doorWide : img.door),
    preload(desktopMQ.matches ? img.archWide : img.arch),
    img.seal ? preload(img.seal) : null,
    document.fonts?.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))]) : null
  ].filter(Boolean);

  let done = 0;
  tasks.forEach((t) => t.finally(() => { bar.style.width = `${Math.round((++done / tasks.length) * 100)}%`; }));

  // Editör önizlemesi kapıyı atlıyorsa yükleme ekranını da atla
  if (previewOpen) loader.remove();

  Promise.allSettled(tasks).then(() => {
    loader.classList.add('is-hidden');
    window.setTimeout(() => loader.remove(), 700);
  });
}

/* ---------- Müzik ---------- */
const audio = document.querySelector('#bgMusic');
const musicToggle = document.querySelector('#musicToggle');
const musicNotes = document.querySelector('#musicNotes');
const NOTES = ['♪', '♫', '♩', '♬'];
let noteTimer = null;

function floatNote() {
  const n = document.createElement('span');
  n.className = 'note';
  n.textContent = NOTES[Math.floor(Math.random() * NOTES.length)];
  n.style.left = `${4 + Math.random() * 30}px`;
  n.style.setProperty('--x', `${Math.round(Math.random() * 54 - 27)}px`);
  n.style.setProperty('--r', `${Math.round(Math.random() * 34 - 17)}deg`);
  n.style.setProperty('--t', `${(2.8 + Math.random() * 1.2).toFixed(2)}s`);
  n.style.setProperty('--s', `${Math.round(16 + Math.random() * 9)}px`);
  n.addEventListener('animationend', () => n.remove(), { once: true });
  musicNotes.appendChild(n);
}

function setMusicState(playing) {
  musicToggle.classList.toggle('is-playing', playing);
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Müziği durdur' : 'Müziği çal');
  window.clearInterval(noteTimer);
  noteTimer = null;
  if (playing) {
    const group = () => [0, 300, 600].forEach((d) => window.setTimeout(floatNote, d));
    group();
    noteTimer = window.setInterval(group, 1700);
  } else {
    musicNotes.replaceChildren();
  }
}

async function playMusic() {
  try {
    audio.volume = 0.42;
    await audio.play();
  } catch (err) {
    console.info('Müzik kullanıcı etkileşimi bekliyor.', err);
  }
}

audio.addEventListener('play', () => setMusicState(true));
audio.addEventListener('pause', () => setMusicState(false));
musicToggle.addEventListener('click', () => (audio.paused ? playMusic() : audio.pause()));

let resumeMusic = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    resumeMusic = !audio.paused;
    audio.pause();
  } else if (resumeMusic) {
    resumeMusic = false;
    playMusic();
  }
});

/* ---------- Geri sayım ---------- */
// Yerel önizleme: ?previewDate=2027-08-01T12:00:00+03:00
const previewParam = import.meta.env.DEV ? new URLSearchParams(location.search).get('previewDate') : null;
const previewDate = previewParam ? Date.parse(previewParam) : NaN;
const timeOffset = Number.isFinite(previewDate) ? previewDate - Date.now() : 0;
const pad = (n) => String(n).padStart(2, '0');

const collectCounters = (cfg) => [...document.querySelectorAll('.countdown')].map((el) => ({
  el,
  target: new Date(cfg.events[Number(el.dataset.event)].start).getTime(),
  finished: cfg.finished?.[Number(el.dataset.event)],
  done: false,
  u: Object.fromEntries([...el.querySelectorAll('[data-u]')].map((b) => [b.dataset.u, b]))
}));
let counters = collectCounters(c);

function tick() {
  const now = Date.now() + timeOffset;
  counters.forEach((ct) => {
    if (ct.done) return;
    const diff = ct.target - now;

    if (diff <= 0) {
      ct.done = true;
      const f = ct.finished;
      ct.el.outerHTML = f
        ? `<div class="cd-finished"><h4>${esc(f.title)}</h4><p>${esc(f.text)}</p><span>${f.note || ''}</span></div>`
        : `<div class="cd-finished"><h4>${esc(L.today)}</h4></div>`;
      return;
    }

    ct.u.d.textContent = pad(Math.floor(diff / 86400000));
    ct.u.h.textContent = pad(Math.floor((diff / 3600000) % 24));
    ct.u.m.textContent = pad(Math.floor((diff / 60000) % 60));
    ct.u.s.textContent = pad(Math.floor((diff / 1000) % 60));
  });
}
tick();
setInterval(tick, 1000);

/* ---------- Bölüm geçişleri ---------- */
let slideEls = [...document.querySelectorAll('.slide')];
const nav = document.querySelector('#nav');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
let current = 0;
let busy = false;
let opened = false;

const canNavigate = () => opened && !document.body.classList.contains('overlay-open');

function updateNav() {
  prevBtn.classList.toggle('is-hidden', current === 0);
  nextBtn.classList.toggle('is-hidden', current === slideEls.length - 1);
}

function goTo(next) {
  if (!canNavigate() || busy || next < 0 || next >= slideEls.length || next === current) return;
  busy = true;

  const dir = next > current ? 1 : -1;
  const from = slideEls[current];
  const to = slideEls[next];
  current = next;
  updateNav();
  if (isPreview && window.parent !== window) window.parent.postMessage({ type: 'kapi:slide', id: slides[next].id }, location.origin);

  gsap.to(from.children, {
    opacity: 0,
    y: -18 * dir,
    duration: 0.35,
    stagger: 0.03,
    ease: 'power2.in',
    onComplete: () => {
      from.classList.remove('is-active');
      gsap.set(from.children, { opacity: 1, y: 0 });
      to.classList.add('is-active');
      gsap.fromTo(
        to.children,
        { opacity: 0, y: 22 * dir },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', onComplete: () => { busy = false; } }
      );
    }
  });
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

const inOverlay = (target) => target instanceof Element && target.closest('.overlay');

/* Fare tekeri ve trackpad */
let wheelSum = 0;
let wheelLocked = false;
let wheelTimer = null;
window.addEventListener('wheel', (e) => {
  if (inOverlay(e.target)) return;
  e.preventDefault();
  if (!canNavigate()) return;

  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => { wheelSum = 0; wheelLocked = false; }, 180);
  if (wheelLocked) return;

  wheelSum += e.deltaY;
  if (Math.abs(wheelSum) >= 40) {
    goTo(current + (wheelSum > 0 ? 1 : -1));
    wheelSum = 0;
    wheelLocked = true;
  }
}, { passive: false });

/* Parmakla kaydırma */
let touchY = null;
window.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (!inOverlay(e.target)) e.preventDefault();
}, { passive: false });
window.addEventListener('touchend', (e) => {
  if (touchY === null) return;
  const dist = touchY - e.changedTouches[0].clientY;
  touchY = null;
  if (Math.abs(dist) > 50) goTo(current + (dist > 0 ? 1 : -1));
}, { passive: true });

/* Klavye */
window.addEventListener('keydown', (e) => {
  if (e.target instanceof Element && e.target.closest('input, textarea, select, .overlay')) return;
  if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
  if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
});

/* ---------- Kapı açılışı ---------- */
const seal = document.querySelector('#seal');
const hint = document.querySelector('#hint');
const doors = document.querySelector('#doors');

slideEls[0].classList.add('is-active');
updateNav();
gsap.set(slideEls[0].children, { opacity: 0, y: 20 });

seal.addEventListener('click', () => {
  if (seal.disabled) return;
  seal.disabled = true;
  seal.classList.add('is-pressed');
  playMusic();

  const tl = gsap.timeline({
    onComplete: () => {
      doors.remove();
      opened = true;
      nav.classList.add('is-on');
    }
  });

  tl.to(hint, { opacity: 0, y: 20, duration: 0.3 })
    .to(seal, { scale: 1.1, duration: 0.18, ease: 'power1.out' }, 0)
    .to(seal, { scale: 0.3, opacity: 0, rotation: 30, duration: 0.45, ease: 'back.in(1.6)' }, 0.18)
    .to('.leaf.left', { rotationY: -108, duration: 1.9, ease: 'power3.inOut' }, 0.5)
    .to('.leaf.right', { rotationY: 108, duration: 1.9, ease: 'power3.inOut' }, 0.5)
    .to('.leaf .shade', { opacity: 1, duration: 1.4, ease: 'power1.in' }, 0.5)
    .to('#backdrop', { opacity: 0.55, duration: 1.4 }, 0.6);

  if (desktopMQ.matches) {
    // Masaüstü: kapılar açılınca kapı boşluğundan içeri "yürü", yatay kemer belirsin
    // Kameranın yürüyeceği nokta: ekrandaki kapı boşluğunun merkezi
    const way = document.querySelector('.doorway').getBoundingClientRect();
    const box = doors.getBoundingClientRect();
    const origin = `${way.left + way.width / 2 - box.left}px ${way.top + way.height / 2 - box.top}px`;

    tl.to(doors, { scale: 3, transformOrigin: origin, duration: 1.5, ease: 'power2.in' }, 1.5)
      .to(doors, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 2.4)
      .fromTo('.arch', { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, 2.4)
      .to(slideEls[0].children, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' }, 2.8);
  } else {
    tl.fromTo('.arch', { scale: 1.08 }, { scale: 1, duration: 2.2, ease: 'power2.out' }, 0.5)
      .to(slideEls[0].children, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' }, 1.6);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) tl.timeScale(4);
});

/* ---------- Editör önizlemesi: kapıyı atla, kaldığı bölümü aç ---------- */
if (previewOpen) {
  doors.remove();
  opened = true;
  nav.classList.add('is-on');
  gsap.set(slideEls[0].children, { opacity: 1, y: 0 });
  const byId = slides.findIndex((sl) => sl.id === previewSlide);
  const target = byId >= 0 ? byId : Math.min(Math.max(0, Number(previewSlide) || 0), slideEls.length - 1);
  if (target > 0) {
    slideEls[0].classList.remove('is-active');
    slideEls[target].classList.add('is-active');
    current = target;
    updateNav();
  }
}

/* ---------- Editör önizlemesi: sayfayı yenilemeden canlı güncelle ---------- */
if (isPreview) {
  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data) return;

    if (e.data.type === 'kapi:goto') {
      const i = slides.findIndex((sl) => sl.id === e.data.id);
      if (i < 0 || i === current) return;
      // Geçiş animasyonu sürüyorsa biraz sonra tekrar dene
      const tryGo = (n) => { if (busy && n > 0) setTimeout(() => tryGo(n - 1), 250); else goTo(i); };
      tryGo(6);
      return;
    }
    if (e.data.type !== 'kapi:data') return;

    const next = normalize(e.data.data);
    L = labelsFor(next);
    names = (next.names || []).filter(Boolean);
    isSingle = names.length < 2;
    const fresh = buildSlides(next);

    // Bölüm eklendi/çıktı (ör. hatırlatma yazıldı/silindi): bütün bölümleri yeniden diz
    if (fresh.map((sl) => sl.id).join() !== slides.map((sl) => sl.id).join()) {
      const curId = slides[current]?.id;
      const content = document.querySelector('.content');
      content.innerHTML = fresh.map((sl, i) => `<section class="slide slide-${sl.id}" data-i="${i}">${sl.html}</section>`).join('');
      slideEls = [...content.querySelectorAll('.slide')];
      const found = fresh.findIndex((sl) => sl.id === curId);
      current = found >= 0 ? found : Math.min(current, slideEls.length - 1);
      slideEls[current].classList.add('is-active');
      if (!opened) gsap.set(slideEls[0].children, { opacity: 0, y: 20 });
      busy = false;
      updateNav();
      slides = fresh;
      drawIcons();
      counters = collectCounters(next);
      tick();
      return;
    }

    fresh.forEach((sl, i) => {
      if (sl.html === slides[i].html) return; // değişmeyen bölüme (ör. haritalar) dokunma
      const keepHidden = !opened && i === 0;
      slideEls[i].innerHTML = sl.html;
      if (keepHidden) gsap.set(slideEls[i].children, { opacity: 0, y: 20 });
    });
    slides = fresh;
    drawIcons();
    counters = collectCounters(next);
    tick();
    const song = document.querySelector('#songSuccess p');
    if (song) song.textContent = next.songSuccess || '';
  });
}

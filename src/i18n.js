// Basit iki dilli yapı: Türkçe metinler HTML'de durur (varsayılan),
// diğer diller burada sözlük olarak tutulur. Eksik anahtar varsa Türkçe kalır.

export const LANGS = ['tr', 'en'];
const KEY = 'lang';

const EN = {
  // Ortak
  'meta.homeTitle': 'Online Invitations | Weddings, Engagements, Birthdays | Bir Haberimiz Var',
  'meta.homeDesc': 'Online invitations for weddings, engagements, henna nights, birthdays and baby showers. Countdown, map, RSVP, guestbook and song requests, shared on WhatsApp.',
  'meta.loginTitle': 'Sign in | Bir Haberimiz Var',

  'nav.designs': 'Designs',
  'nav.features': 'Features',
  'nav.how': 'How it works',
  'nav.faq': 'FAQ',
  'nav.login': 'Sign in',
  'nav.account': 'My account',
  'nav.logout': 'Sign out',
  'nav.demo': 'See demo',
  'nav.home': 'Home',
  'nav.panel': 'My dashboard',

  // Ana sayfa
  'hero.eyebrow': 'Online invitations',
  'hero.title': 'Share your big news <mark>with a single link</mark>.',
  'hero.lead': 'Weddings, engagements, henna nights, birthdays… Send your personal invitation page on WhatsApp; location, countdown and RSVPs right in your guests’ pockets.',
  'hero.cta': 'Open live demo',
  'hero.create': 'Create your invitation',
  'hero.cta2': 'Browse designs',
  'hero.p1': 'No app needed',
  'hero.p2': 'Phone &amp; desktop',
  'hero.p3': 'RSVP tracking',
  'hero.tagA': 'Ayşe is coming · 2 guests',
  'hero.tagB': '42 days to go',

  'designs.eyebrow': 'Designs',
  'designs.title': 'Every one is an opening scene',
  'designs.text': 'Tap the seal and the doors open, or the envelope slides apart. Your invitation impresses from the very first second.',
  'designs.d1': 'Door · Peony',
  'designs.d1s': 'Sealed doors, floral arch',
  'designs.d2': 'Envelope',
  'designs.d2s': 'Kraft envelope, burgundy wax seal',
  'designs.soon': 'Coming soon',
  'designs.soonSub': 'New themes on the way',
  'designs.soonText': 'Olive, Tulip<br />and more',

  'features.eyebrow': 'Features',
  'features.title': 'Everything your guests need, in one place',
  'features.f1': 'RSVP',
  'features.f1s': '“I’ll be there” or “Can’t make it”, saved together with the number of guests.',
  'features.f2': 'Countdown',
  'features.f2s': 'Days, hours, minutes and seconds until the big day.',
  'features.f3': 'Map &amp; directions',
  'features.f3s': 'A location for every event, directions in one tap.',
  'features.f4': 'Guestbook',
  'features.f4s': 'Your guests’ warm wishes collect on the invitation.',
  'features.f5': 'Song requests',
  'features.f5s': 'Guests send you the songs they want to hear that night.',
  'features.f6': 'Background music',
  'features.f6s': 'Your chosen song starts playing when the invitation opens.',
  'features.f7': 'One-tap contact',
  'features.f7s': 'A call or a WhatsApp message, just one tap away.',
  'features.f8': 'Fits every screen',
  'features.f8s': 'Portrait on phones, wide on desktops; full screen at any size.',

  'how.eyebrow': 'How it works',
  'how.title': 'Your invitation in three steps',
  'how.s1': 'Pick a design',
  'how.s1s': 'Choose the template that suits your event and your taste.',
  'how.s2': 'Send your details',
  'how.s2s': 'Names, date, venue, contacts and music; we take care of the rest.',
  'how.s3': 'Share the link',
  'how.s3s': 'Send it on WhatsApp and watch the replies come in.',
  'how.ev1': 'Wedding',
  'how.ev2': 'Engagement',
  'how.ev3': 'Henna night',
  'how.ev4': 'Birthday',
  'how.ev5': 'Baby shower',
  'how.ev6': 'Circumcision',
  'how.ev7': 'Graduation',

  'faq.eyebrow': 'FAQ',
  'faq.title': 'Good to know',
  'faq.text': 'Have another question? Open the demo and try it yourself; it’s exactly what your guests will see.',
  'faq.q1': 'How do I share the link?',
  'faq.a1': 'When your invitation is ready you get a personal link. Send it on WhatsApp, Instagram or SMS to anyone you like.',
  'faq.q2': 'Do my guests need to install an app?',
  'faq.a2': 'No. The invitation opens in the browser and works on phones, tablets and computers without installing anything.',
  'faq.q3': 'How do I see the RSVPs?',
  'faq.a3': 'Guests reply on the RSVP page of the invitation; their names, guest counts and notes are saved.',
  'faq.q4': 'Can I change the details after sending?',
  'faq.a4': 'Yes. When the time, venue or text changes, the invitation updates and the link stays the same.',
  'faq.q5': 'Can I add more than one event?',
  'faq.a5': 'Yes. For example, the ceremony and the reception can share one invitation, each with its own date, location and countdown.',

  'cta.title': 'Ready to share your news?',
  'cta.text': 'Open the editor, type your details and watch your invitation come to life. Free to try, no sign-up.',
  'cta.btn': 'Get started',
  'footer': 'Online invitations · © 2026',

  // Giriş sayfası
  'login.asideTitle': 'Your invitation, <br />your guests, in one place.',
  'login.asideText': 'Your drafts, your live invitation and your guests’ replies, all in your dashboard.',
  'login.title': 'Sign in',
  'login.sub': 'No password. Enter your email and a sign-in link lands in your inbox.',
  'login.kicker': 'Welcome back',
  'login.showTitle': 'Your invitations<br /><em>are waiting.</em>',
  'login.f1': 'Passwordless, one-tap sign-in',
  'login.f2': 'Your drafts on every device',
  'login.f3': 'Guest replies in one place',
  'login.showText': 'Return to your drafts, create a new invitation and follow your guests’ replies.',
  'login.noAccount': 'No invitation yet?',
  'login.startFree': 'Start for free →',
  'login.email': 'Email',
  'login.send': 'Send sign-in link',
  'login.or': 'or',
  'login.google': 'Continue with Google',
  'login.kvkk': 'By continuing you confirm you have read the <a href="/kvkk/">Privacy Notice</a>.',
  'login.sentTitle': 'Check your email',
  'login.sentText': 'We sent a sign-in link to <b>{email}</b>.',
  'login.sentHint': 'Your dashboard opens when you click the link. Don’t see it? Check your spam folder.',
  'login.resend': 'Send again',
  'login.resendIn': 'Send again ({s}s)',
  'login.change': 'Use a different email',

  // Panel
  'meta.panelTitle': 'My dashboard | Bir Haberimiz Var',
  'panel.eyebrow': 'My dashboard',
  'panel.hello': 'Welcome',
  'panel.helloName': 'Hello, {name}',
  'panel.whoGuest': 'You’re working as a guest.',
  'panel.whoEmail': 'Signed in as <b>{email}</b>.',
  'panel.verified': 'Your email is verified. Your account is now secure.',
  'panel.claimTitle': 'Don’t lose your draft',
  'panel.claimText': 'You’re working as a guest right now. Add your email to manage your invitation from any device. No password.',
  'panel.claimBtn': 'Add my email',
  'panel.consent': 'I have read the <a href="/kvkk/">Privacy Notice</a> and agree to receive emails about my invitation.',
  'panel.pending': 'We sent a verification link to <b>{email}</b>. Click it to secure your account.',
  'panel.resent': 'Sent again ✓',
  'panel.listTitle': 'My invitations',
  'panel.loading': 'Loading your invitations…',
  'panel.untitled': 'Untitled invitation',
  'panel.updated': 'updated {date}',
  'panel.view': 'View',
  'panel.status.taslak': 'Draft',
  'panel.status.odeme_bekliyor': 'Awaiting payment',
  'panel.status.yayinda': 'Live',
  'panel.emptyTitle': 'No invitations yet',
  'panel.emptyText': 'Pick a design and add your details; your draft will show up here.',
  'panel.emptyBtn': 'Create my invitation',
  'panel.new': '+ New invitation',

  // Editör
  'meta.editorTitle': 'Invitation editor | Bir Haberimiz Var',
  'ed.eyebrow': 'Invitation editor',
  'ed.title': 'Create your invitation',
  'ed.sub': 'The preview updates as you type. Your draft is saved automatically.',
  'ed.s1': 'Design',
  'ed.soon': 'Soon',
  'ed.s2': 'Names and message',
  'ed.couple': 'Couple',
  'ed.single': 'One person',
  'ed.name1': 'First name',
  'ed.name2': 'Second name',
  'ed.eyebrowLabel': 'Top line',
  'ed.monogram': 'Seal letters',
  'ed.message': 'Invitation message',
  'ed.s3': 'Events',
  'ed.s3hint': 'Add more than one event, like a ceremony and a reception. Each gets its own countdown and map.',
  'ed.addEvent': 'Add event',
  'ed.event': 'Event',
  'ed.remove': 'Remove',
  'ed.evLabel': 'Event name',
  'ed.evStart': 'Date &amp; time',
  'ed.evPlace': 'Venue',
  'ed.evHall': 'Hall (optional)',
  'ed.evCity': 'City · District',
  'ed.evMaps': 'Map search (optional)',
  'ed.evMapsPh': 'Venue + city is used if empty',
  'ed.s4': 'Reminder and RSVP',
  'ed.remTitle': 'Reminder title',
  'ed.remText': 'Reminder text <small>(this section is hidden if empty)</small>',
  'ed.rsvpYes': '“Attending” button',
  'ed.rsvpNo': '“Not attending” button',
  'ed.s5': 'Contact',
  'ed.s5hint': 'Your guests can call these people or message them on WhatsApp in one tap.',
  'ed.addContact': 'Add person',
  'ed.cName': 'Name',
  'ed.cPhone': 'Phone',
  'ed.songThanks': 'Song request thank-you message',
  'ed.s6': 'Link and publishing',
  'ed.localOnly': 'Your draft is only stored on this device right now. Sign in to get a link and publish.',
  'ed.loginToSave': 'Sign in and save',
  'ed.slug': 'Your invitation link',
  'ed.slugSave': 'Save link',
  'ed.open': 'Open',
  'ed.copy': 'Copy',
  'ed.slugBad': 'Use 3–60 characters: lowercase letters, numbers and hyphens.',
  'ed.slugTaken': 'This link is taken. Please try another one.',
  'ed.slugSaved': 'Link saved.',
  'ed.copied': 'Link copied.',
  'ed.pubGuestTitle': 'Before payment',
  'ed.pubGuestText': 'Add your email to manage your invitation from any device. No password.',
  'ed.pubReadyTitle': 'All set',
  'ed.pubReadyText': 'If you’ve checked your invitation, you can continue to payment.',
  'ed.pay': 'Continue to payment',
  'ed.payPending': 'Your invitation is marked as awaiting payment. We’ll publish it once payment is confirmed.',
  'ed.preview': 'Preview',
  'ed.replay': 'Play the doors',
  'ed.save.saving': 'Saving…',
  'ed.save.saved': 'Saved',
  'ed.save.local': 'Saved on this device',
  'ed.save.error': 'Couldn’t save',
  'panel.edit': 'Edit',
  'panel.preview': 'Preview',

  // Mesajlar (JS)
  'msg.badEmail': 'Please enter a valid email address.',
  'msg.consent': 'Please confirm you have read the Privacy Notice.',
  'msg.emailTaken': 'This email is already linked to another account. Sign in with it instead.',
  'msg.rate': 'Too many attempts. Please wait a little and try again.',
  'msg.guestOff': 'Guest sessions are turned off right now.',
  'msg.googleOff': 'Google sign-in isn’t available yet. Please use your email.',
  'msg.signupOff': 'New sign-ups are closed right now.',
  'msg.generic': 'Something went wrong. Please try again.',
  'msg.wait': 'Please wait…'
};

const TR_MSG = {
  'ed.event': 'Etkinlik',
  'ed.remove': 'Kaldır',
  'ed.evLabel': 'Etkinlik adı',
  'ed.evStart': 'Tarih ve saat',
  'ed.evPlace': 'Mekan',
  'ed.evHall': 'Salon (isteğe bağlı)',
  'ed.evCity': 'Şehir · İlçe',
  'ed.evMaps': 'Harita araması (isteğe bağlı)',
  'ed.evMapsPh': 'Boşsa mekan + şehir kullanılır',
  'ed.cName': 'İsim',
  'ed.cPhone': 'Telefon',
  'ed.slugBad': '3–60 karakter kullanın: küçük harf, rakam ve tire.',
  'ed.slugTaken': 'Bu bağlantı alınmış. Lütfen başka bir tane deneyin.',
  'ed.slugSaved': 'Bağlantı kaydedildi.',
  'ed.copied': 'Bağlantı kopyalandı.',
  'ed.payPending': 'Davetiyeniz "ödeme bekliyor" olarak işaretlendi. Ödeme onaylanınca yayına alınacak.',
  'ed.save.saving': 'Kaydediliyor…',
  'ed.save.saved': 'Kaydedildi',
  'ed.save.local': 'Bu cihazda kaydedildi',
  'ed.save.error': 'Kaydedilemedi',
  'panel.edit': 'Düzenle',
  'panel.preview': 'Önizle',
  'login.send': 'Giriş bağlantısı gönder',
  'login.sentText': '<b>{email}</b> adresine bir giriş bağlantısı gönderdik.',
  'login.resend': 'Tekrar gönder',
  'login.resendIn': 'Tekrar gönder ({s} sn)',
  'panel.hello': 'Hoş geldiniz',
  'panel.helloName': 'Merhaba, {name}',
  'panel.whoGuest': 'Misafir olarak çalışıyorsunuz.',
  'panel.whoEmail': '<b>{email}</b> ile giriş yaptınız.',
  'panel.claimBtn': 'E-postamı ekle',
  'panel.pending': '<b>{email}</b> adresine bir doğrulama bağlantısı gönderdik. Hesabınızı güvenceye almak için bağlantıya tıklayın.',
  'panel.resent': 'Tekrar gönderildi ✓',
  'panel.untitled': 'İsimsiz davetiye',
  'panel.updated': '{date} güncellendi',
  'panel.view': 'Görüntüle',
  'panel.status.taslak': 'Taslak',
  'panel.status.odeme_bekliyor': 'Ödeme bekliyor',
  'panel.status.yayinda': 'Yayında',
  'msg.badEmail': 'Geçerli bir e-posta adresi girin.',
  'msg.consent': 'Lütfen Aydınlatma Metni onayını işaretleyin.',
  'msg.emailTaken': 'Bu e-posta başka bir hesaba bağlı. O e-postayla giriş yapın.',
  'msg.rate': 'Çok fazla deneme yapıldı. Biraz bekleyip tekrar deneyin.',
  'msg.guestOff': 'Misafir oturumu şu an kapalı.',
  'msg.googleOff': 'Google ile giriş henüz açık değil. Lütfen e-postanızı kullanın.',
  'msg.signupOff': 'Yeni kayıtlar şu an kapalı.',
  'msg.generic': 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
  'msg.wait': 'Lütfen bekleyin…'
};

const DICT = { en: EN, tr: TR_MSG };
const originals = new WeakMap();
const attrOriginals = new WeakMap();
const listeners = new Set();

const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v); } catch { /* yoksay */ } };

function initialLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(q)) return q;
  const saved = read();
  return LANGS.includes(saved) ? saved : 'tr';
}

let current = initialLang();
export const getLang = () => current;

// JS içindeki metinler için. HTML'deki Türkçe karşılığı yoksa TR_MSG'den gelir.
export function t(key, vars = {}) {
  const s = DICT[current]?.[key] ?? TR_MSG[key] ?? EN[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => escapeHtml(vars[k] ?? ''));
}

export function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function applyLang(lang = current, root = document) {
  current = lang;
  document.documentElement.lang = lang;

  root.querySelectorAll('[data-i18n]').forEach((el) => {
    if (!originals.has(el)) originals.set(el, el.innerHTML);
    const v = lang === 'tr' ? undefined : DICT[lang]?.[el.dataset.i18n];
    el.innerHTML = v ?? originals.get(el);
  });

  // data-i18n-attr="placeholder:login.namePh;aria-label:nav.login"
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    if (!attrOriginals.has(el)) attrOriginals.set(el, {});
    const saved = attrOriginals.get(el);
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':').map((x) => x.trim());
      if (!(attr in saved)) saved[attr] = el.getAttribute(attr);
      const v = lang === 'tr' ? undefined : DICT[lang]?.[key];
      el.setAttribute(attr, v ?? saved[attr]);
    });
  });

  // Sayfa başlığı ve açıklama
  const page = document.body.dataset.page;
  if (page) {
    if (!originals.has(document)) originals.set(document, {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content
    });
    const o = originals.get(document);
    document.title = lang === 'tr' ? o.title : (DICT[lang][`meta.${page}Title`] ?? o.title);
    const d = document.querySelector('meta[name="description"]');
    if (d) d.content = lang === 'tr' ? o.desc : (DICT[lang][`meta.${page}Desc`] ?? o.desc);
  }

  document.querySelectorAll('.lang-switch [data-lang]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
  listeners.forEach((fn) => fn(lang));
}

export function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  write(lang);
  applyLang(lang);
}

export const onLangChange = (fn) => listeners.add(fn);

export function initI18n() {
  document.querySelectorAll('.lang-switch [data-lang]').forEach((b) => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
  applyLang(current);
}

import { createIcons, Plus, Trash2, Eye, X, RotateCcw, HardDrive, Mail } from 'lucide';
import { initI18n, onLangChange, t, escapeHtml } from './i18n.js';
import { supabase, ensureGuest, getUser, isGuest, isVerified, pendingEmail, linkEmail, onAuth, authErrorKey } from './auth.js';
import { PREVIEW_KEY } from './invitation-source-keys.js';

const $ = (id) => document.getElementById(id);
const icons = () => createIcons({ icons: { Plus, Trash2, Eye, X, RotateCcw, HardDrive, Mail }, attrs: { 'stroke-width': 1.7 } });

const LOCAL_KEY = 'editor:draft';
const MAX_EVENTS = 4;
const MAX_CONTACTS = 4;

/* ---------- Varsayılan taslak ---------- */
function defaultStart() {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T19:00`;
}

const defaults = () => ({
  single: false,
  names: ['', ''],
  eyebrow: '',
  monogram: '',
  message: '',
  events: [{ label: 'DÜĞÜN', start: defaultStart(), place: '', hall: '', city: '', maps: '' }],
  reminder: { title: '', text: '' },
  rsvpYes: '',
  rsvpNo: '',
  contacts: [{ name: '', phone: '' }],
  songSuccess: ''
});

// Önizlemede boş alanlar örnek yazıyla dolsun
function forPreview(d) {
  const names = d.single ? [d.names[0] || 'Defne'] : [d.names[0] || 'Ayşe', d.names[1] || 'Can'];
  return {
    ...d,
    names,
    message: d.message || 'Hayatımızın en güzel gününde sizleri de aramızda görmekten mutluluk duyarız.',
    events: d.events.map((e) => ({ ...e, label: e.label || 'ETKİNLİK', place: e.place || 'Mekan adı', city: e.city || 'Şehir' })),
    contacts: d.contacts.some((p) => p.name && p.phone) ? d.contacts : [{ name: names[0], phone: '905000000000' }]
  };
}

/* ---------- Durum ---------- */
let state = defaults();
let record = { id: null, slug: '', status: 'taslak' };
let user = null;
let cloud = false; // veritabanına kaydedebiliyor muyuz?

function readLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || null; } catch { return null; }
}
function writeLocal() {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...record, data: state }));
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(forPreview(state)));
  } catch { /* depolama kapalı */ }
}

const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
function setPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, k) => (o[k] ??= {}), obj);
  target[last] = value;
}

/* ---------- Kaydetme ---------- */
const pill = $('savePill');
function setPill(s) {
  pill.dataset.state = s;
  pill.textContent = s === 'idle' ? '' : t(`ed.save.${s}`);
}

let saveTimer = 0;
let saving = null;
let dirty = false;

function changed() {
  writeLocal();
  schedulePreview();
  if (!cloud) { setPill('local'); return; }
  dirty = true;
  setPill('saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCloud, 1200);
}

const titleOf = () => (state.single ? [state.names[0]] : state.names).map((n) => n.trim()).filter(Boolean).join(' & ') || null;

async function saveCloud() {
  if (!cloud || !dirty) return;
  if (saving) { await saving; return saveCloud(); }
  dirty = false;
  saving = (async () => {
    try {
      if (!record.id) {
        const { data, error } = await supabase
          .from('davetiyeler')
          .insert({ title: titleOf(), template: 'kapi', data: state })
          .select('id, slug, status')
          .single();
        if (error) throw error;
        record = { ...record, ...data };
        history.replaceState(null, '', `?id=${record.id}`);
      } else {
        const { error } = await supabase.from('davetiyeler').update({ title: titleOf(), data: state }).eq('id', record.id);
        if (error) throw error;
      }
      writeLocal();
      setPill(dirty ? 'saving' : 'saved');
      renderPublish();
    } catch (err) {
      console.warn('Taslak kaydedilemedi:', err);
      dirty = true;
      setPill('error');
    } finally {
      saving = null;
    }
  })();
  return saving;
}

window.addEventListener('beforeunload', (e) => {
  if (cloud && dirty) { saveCloud(); e.preventDefault(); }
});

/* ---------- Form ---------- */
const form = $('edForm');

function fillStatic() {
  form.querySelectorAll('[data-path]').forEach((el) => {
    if (el.closest('#events, #contacts')) return;
    el.value = getPath(state, el.dataset.path) ?? '';
  });
  form.querySelectorAll('[data-single]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.single) === Number(state.single))));
  $('name2Field').hidden = state.single;
}

function renderEvents() {
  $('events').innerHTML = state.events.map((e, i) => `
    <div class="item" data-preview="locations">
      <div class="item-head">
        <b>${escapeHtml(e.label || t('ed.event'))}</b>
        ${state.events.length > 1 ? `<button type="button" class="icon-del" data-del-event="${i}" aria-label="${t('ed.remove')}"><i data-lucide="trash-2"></i></button>` : ''}
      </div>
      <div class="row2">
        <label class="field"><span>${t('ed.evLabel')}</span><input data-path="events.${i}.label" maxlength="30" placeholder="NİKAH" value="${escapeHtml(e.label)}" /></label>
        <label class="field"><span>${t('ed.evStart')}</span><input type="datetime-local" data-path="events.${i}.start" value="${escapeHtml(e.start)}" /></label>
      </div>
      <div class="row2">
        <label class="field"><span>${t('ed.evPlace')}</span><input data-path="events.${i}.place" maxlength="80" placeholder="Kuğu Gölü Davet" value="${escapeHtml(e.place)}" /></label>
        <label class="field"><span>${t('ed.evHall')}</span><input data-path="events.${i}.hall" maxlength="60" placeholder="Salon Lotus" value="${escapeHtml(e.hall)}" /></label>
      </div>
      <div class="row2">
        <label class="field"><span>${t('ed.evCity')}</span><input data-path="events.${i}.city" maxlength="80" placeholder="İstanbul · Maltepe" value="${escapeHtml(e.city)}" /></label>
        <label class="field"><span>${t('ed.evMaps')}</span><input data-path="events.${i}.maps" maxlength="160" placeholder="${t('ed.evMapsPh')}" value="${escapeHtml(e.maps)}" /></label>
      </div>
    </div>`).join('');
  $('addEvent').hidden = state.events.length >= MAX_EVENTS;
  icons();
}

function renderContacts() {
  $('contacts').innerHTML = state.contacts.map((p, i) => `
    <div class="item item-inline" data-preview="contact">
      <label class="field"><span>${t('ed.cName')}</span><input data-path="contacts.${i}.name" maxlength="40" placeholder="Ayşe" value="${escapeHtml(p.name)}" /></label>
      <label class="field"><span>${t('ed.cPhone')}</span><input type="tel" inputmode="tel" data-path="contacts.${i}.phone" maxlength="20" placeholder="0532 123 45 67" value="${escapeHtml(p.phone)}" /></label>
      <button type="button" class="icon-del" data-del-contact="${i}" aria-label="${t('ed.remove')}"><i data-lucide="trash-2"></i></button>
    </div>`).join('');
  $('addContact').hidden = state.contacts.length >= MAX_CONTACTS;
  icons();
}

form.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.dataset?.path) return;
  setPath(state, el.dataset.path, el.value);
  if (/^events\.\d+\.label$/.test(el.dataset.path)) {
    const head = el.closest('.item')?.querySelector('.item-head b');
    if (head) head.textContent = el.value || t('ed.event');
  }
  if (el.dataset.path.startsWith('names.')) suggestSlug();
  showSlide(el.closest('[data-preview]')?.dataset.preview);
  changed();
});

form.addEventListener('click', (e) => {
  const single = e.target.closest('[data-single]');
  if (single) {
    state.single = single.dataset.single === '1';
    fillStatic();
    suggestSlug();
    changed();
    return;
  }
  const delEv = e.target.closest('[data-del-event]');
  if (delEv) { state.events.splice(Number(delEv.dataset.delEvent), 1); renderEvents(); changed(); return; }
  const delC = e.target.closest('[data-del-contact]');
  if (delC) {
    state.contacts.splice(Number(delC.dataset.delContact), 1);
    if (!state.contacts.length) state.contacts.push({ name: '', phone: '' });
    renderContacts();
    changed();
  }
});

$('addEvent').addEventListener('click', () => {
  if (state.events.length >= MAX_EVENTS) return;
  state.events.push({ label: '', start: state.events.at(-1)?.start || defaultStart(), place: '', hall: '', city: '', maps: '' });
  renderEvents();
  changed();
  $('events').lastElementChild?.querySelector('input')?.focus();
});
$('addContact').addEventListener('click', () => {
  if (state.contacts.length >= MAX_CONTACTS) return;
  state.contacts.push({ name: '', phone: '' });
  renderContacts();
  changed();
  $('contacts').lastElementChild?.querySelector('input')?.focus();
});

/* ---------- Önizleme ---------- */
const frame = $('pvFrame');
const phone = $('pvPhone');
const stage = $('pvStage');
let slide = 'invite';
let previewTimer = 0;

function previewUrl(open = true) {
  return `/kapi/?preview=1${open ? `&open=1&slide=${encodeURIComponent(slide)}` : ''}`;
}
function reloadPreview(open = true) {
  const url = previewUrl(open);
  try { frame.contentWindow.location.replace(url); } catch { frame.src = url; }
}
// Önizlemeyi yenilemeden güncelle: veri iframe'e mesajla gider
const post = (msg) => {
  try { frame.contentWindow?.postMessage(msg, location.origin); } catch { /* iframe hazır değil */ }
};
function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    post({ type: 'kapi:data', data: forPreview(state) });
    post({ type: 'kapi:goto', id: slide }); // veri geldikten sonra ilgili bölüme geç
  }, 120);
}
function showSlide(id, now = false) {
  if (!id || id === slide) return;
  slide = id;
  if (now) post({ type: 'kapi:goto', id });
}

window.addEventListener('message', (e) => {
  if (e.origin === location.origin && e.data?.type === 'kapi:slide') slide = e.data.id;
});

// Düzenlenen bölüme göre önizlemeyi o sayfaya götür
form.addEventListener('focusin', (e) => {
  showSlide(e.target.closest('[data-preview]')?.dataset.preview, true);
});

$('replay').addEventListener('click', () => { slide = 'invite'; reloadPreview(false); });

// Telefon çerçevesini alana sığdır
const PHONE_W = 390;
const PHONE_H = 844;
function fitPhone() {
  const r = stage.getBoundingClientRect();
  const scale = Math.min(1, (r.width - 24) / (PHONE_W + 20), (r.height - 24) / (PHONE_H + 20));
  phone.style.setProperty('--s', String(Math.max(0.3, scale)));
}
new ResizeObserver(fitPhone).observe(stage);

// Mobilde önizleme tam ekran açılır
$('openPreview').addEventListener('click', () => {
  document.body.classList.add('show-preview');
  fitPhone();
});
$('closePreview').addEventListener('click', () => document.body.classList.remove('show-preview'));

/* ---------- Bağlantı (slug) ---------- */
const slugInput = $('slugInput');
const slugMsg = $('slugMsg');
let slugTouched = false;

const TR_MAP = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
const slugify = (v) => v.toLocaleLowerCase('tr-TR')
  .replace(/[çğıöşüâîû]/g, (ch) => TR_MAP[ch])
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

function suggestSlug() {
  if (slugTouched || record.slug) return;
  slugInput.value = slugify((state.single ? [state.names[0]] : state.names).filter(Boolean).join(' '));
}

slugInput.addEventListener('input', () => {
  slugTouched = true;
  const clean = slugify(slugInput.value);
  if (clean !== slugInput.value && !slugInput.value.endsWith('-')) slugInput.value = clean;
});

function showSlugMsg(text, type = 'error') {
  slugMsg.innerHTML = text;
  slugMsg.className = `auth-msg is-${type}`;
  slugMsg.hidden = false;
}

function renderSlug() {
  const has = !!record.slug;
  const url = has ? `${location.origin}/kapi/?d=${encodeURIComponent(record.slug)}` : '';
  $('slugOpen').hidden = !has;
  $('slugCopy').hidden = !has;
  if (has) $('slugOpen').href = url;
}

$('slugSave').addEventListener('click', async () => {
  const value = slugify(slugInput.value);
  slugInput.value = value;
  if (!/^[a-z0-9-]{3,60}$/.test(value)) return showSlugMsg(t('ed.slugBad'));
  if (!record.id) { dirty = true; await saveCloud(); }
  if (!record.id) return showSlugMsg(t('msg.generic'));
  const { error } = await supabase.from('davetiyeler').update({ slug: value }).eq('id', record.id);
  if (error) return showSlugMsg(t(error.code === '23505' ? 'ed.slugTaken' : 'msg.generic'));
  record.slug = value;
  writeLocal();
  renderSlug();
  showSlugMsg(t('ed.slugSaved'), 'success');
});

$('slugCopy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(`${location.origin}/kapi/?d=${record.slug}`);
    showSlugMsg(t('ed.copied'), 'success');
  } catch { /* pano izni yok */ }
});

/* ---------- Yayın / hesap durumu ---------- */
function renderPublish() {
  $('pubLocal').hidden = cloud;
  $('pubCloud').hidden = !cloud;
  if (!cloud) return;

  const pending = pendingEmail(user);
  $('pubGuest').hidden = !(isGuest(user) && !pending);
  $('pubPending').hidden = !pending;
  if (pending) $('pubPendingText').innerHTML = t('panel.pending', { email: pending });
  $('pubReady').hidden = !isVerified(user);
  if (record.status === 'odeme_bekliyor') {
    $('pubReadyText').textContent = t('ed.payPending');
    $('payBtn').hidden = true;
  }
  renderSlug();
}

$('claimForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('claimMsg');
  const btn = $('claimSubmit');
  const email = $('claimEmail').value.trim();
  const fail = (text) => { msg.textContent = text; msg.className = 'auth-msg is-error'; msg.hidden = false; };
  msg.hidden = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(t('msg.badEmail'));
  if (!$('claimConsent').checked) return fail(t('msg.consent'));
  btn.disabled = true;
  try {
    user = await linkEmail(email);
    renderPublish();
  } catch (err) {
    fail(t(authErrorKey(err)));
  } finally {
    btn.disabled = false;
  }
});

$('payBtn').addEventListener('click', async () => {
  if (!record.id || !isVerified(user)) return;
  await saveCloud();
  const { error } = await supabase.from('davetiyeler').update({ status: 'odeme_bekliyor' }).eq('id', record.id);
  if (error) { showSlugMsg(t('msg.generic')); return; }
  record.status = 'odeme_bekliyor';
  renderPublish();
});

/* ---------- Başlat ---------- */
function applyData(data) {
  const base = defaults();
  state = { ...base, ...data, reminder: { ...base.reminder, ...(data?.reminder || {}) } };
  if (!Array.isArray(state.names)) state.names = ['', ''];
  while (state.names.length < 2) state.names.push('');
  if (!state.events?.length) state.events = base.events;
  if (!state.contacts?.length) state.contacts = base.contacts;
}

function renderAll() {
  fillStatic();
  renderEvents();
  renderContacts();
  suggestSlug();
  if (record.slug) slugInput.value = record.slug;
  renderPublish();
}

initI18n();
onLangChange(() => {
  renderEvents();
  renderContacts();
  renderPublish();
  setPill(pill.dataset.state);
});
icons();

(async () => {
  // 1) Önce bu cihazdaki taslak (anında açılsın). ?new=1 → boş taslakla başla
  const qs = new URLSearchParams(location.search);
  if (qs.has('new')) {
    try { localStorage.removeItem(LOCAL_KEY); } catch { /* yoksay */ }
    history.replaceState(null, '', location.pathname);
  }
  const local = readLocal();
  if (local?.data) {
    applyData(local.data);
    record = { id: local.id || null, slug: local.slug || '', status: local.status || 'taslak' };
  }
  renderAll();
  writeLocal();
  reloadPreview(true);

  // 2) Oturum: yoksa sessizce misafir oturumu aç
  try {
    user = await ensureGuest();
    cloud = true;
  } catch (err) {
    console.info('Misafir oturumu açılamadı, taslak bu cihazda tutulacak:', err?.message);
    user = await getUser();
    cloud = !!user;
  }

  // 3) ?id= ile gelindiyse (panelden "Düzenle") o taslağı yükle
  const wantId = new URLSearchParams(location.search).get('id') || record.id;
  if (cloud && wantId) {
    const { data, error } = await supabase
      .from('davetiyeler')
      .select('id, slug, status, data')
      .eq('id', wantId)
      .maybeSingle();
    if (!error && data) {
      record = { id: data.id, slug: data.slug || '', status: data.status };
      // Bu cihazda daha yeni bir düzenleme yoksa veritabanındakini al
      if (!local || local.id !== data.id) applyData(data.data);
      renderAll();
      writeLocal();
      schedulePreview();
    } else {
      // Başka hesabın taslağı ya da silinmiş: yeni kayıt olarak devam et
      record = { id: null, slug: '', status: 'taslak' };
    }
  }

  setPill(cloud ? (record.id ? 'saved' : 'idle') : 'local');
  renderPublish();
  if (cloud && !record.id && (state.names[0] || state.message)) { dirty = true; saveCloud(); }

  onAuth((u) => { if (u) { user = u; renderPublish(); } });
})();

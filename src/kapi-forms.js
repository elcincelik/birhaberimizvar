/* Kapı şablonu: Anı defteri ve şarkı isteği (ana sayfadaki ile aynı Supabase tabloları) */
import { supabase } from './supabase.js';

// Editör önizlemesinde veritabanına hiçbir şey yazılmaz/okunmaz
let readOnly = false;
const fakeQuery = () => {
  const q = new Proxy({}, {
    get: (_, key) => (key === 'then'
      ? (resolve) => resolve({ data: [], error: null })
      : () => q)
  });
  return q;
};
const db = (table) => (readOnly ? fakeQuery() : supabase.from(table));

const esc = (v = '') =>
  String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const divider = (mark = '♥') => `<div class="ov-divider" aria-hidden="true"><span></span><b>${mark}</b><span></span></div>`;

export function buildOverlays(c, L) {
  return `
  <section class="overlay" id="rsvpSection" hidden aria-label="${esc(L.rsvpFormTitle)}">
    <div class="overlay-shell">
      <button type="button" class="overlay-close" data-close aria-label="Kapat">×</button>

      <header class="ov-header">
        <span class="ov-emblem" aria-hidden="true"><i data-lucide="mail-check"></i></span>
        <h2>${esc(L.rsvpFormTitle)}</h2>
        ${divider()}
        <p>${esc(L.rsvpFormText)}</p>
      </header>

      <div class="ov-tabs" role="radiogroup" aria-label="${esc(L.rsvpTitle)}">
        <button type="button" class="ov-tab" data-rsvp="yes" role="radio" aria-checked="false">
          <i data-lucide="heart"></i><span>${esc(L.rsvpYes)}</span>
        </button>
        <button type="button" class="ov-tab" data-rsvp="no" role="radio" aria-checked="false">
          <i data-lucide="heart-crack"></i><span>${esc(L.rsvpNo)}</span>
        </button>
      </div>

      <form id="rsvpForm" novalidate>
        <label class="ov-field">
          <span>${esc(L.rsvpName)} <b>*</b></span>
          <input type="text" id="rsvpName" maxlength="80" placeholder="${esc(L.rsvpNamePlaceholder)}" autocomplete="name" required>
        </label>

        <div class="ov-field" id="rsvpGuestsField">
          <span>${esc(L.rsvpGuests)}</span>
          <div class="stepper">
            <button type="button" data-step="-1" aria-label="Azalt">−</button>
            <output id="rsvpGuests" aria-live="polite">1</output>
            <button type="button" data-step="1" aria-label="Artır">+</button>
          </div>
        </div>

        <label class="ov-field">
          <span>${esc(L.rsvpNote)} <small>(İsteğe bağlı)</small></span>
          <textarea id="rsvpNote" maxlength="300" placeholder="${esc(L.rsvpNotePlaceholder)}"></textarea>
        </label>

        <p class="ov-error" id="rsvpError" role="alert"></p>
        <button type="submit" class="ov-button wide" id="rsvpSubmit"><i data-lucide="send"></i> ${esc(L.rsvpSubmit)}</button>
      </form>
    </div>
  </section>

  <section class="overlay" id="guestbookSection" hidden aria-label="Anı defteri">
    <div class="overlay-shell">
      <button type="button" class="overlay-close" data-close aria-label="Anı defterini kapat">×</button>

      <header class="ov-header">
        <span class="ov-emblem" aria-hidden="true"><i data-lucide="feather"></i></span>
        <h2>Anı Defterimiz</h2>
        ${divider('♡')}
        <p>Bu özel günde bizimle paylaştığınız dilekler, yıllar sonra bile gülümsetecek en değerli hatıralarımız olacak.</p>
      </header>

      <div class="ov-tabs" role="tablist" aria-label="Anı defteri sekmeleri">
        <button type="button" class="ov-tab is-active" data-tab="messages" role="tab" aria-selected="true">
          <i data-lucide="message-circle"></i><span>Mesajlar (<b id="gbCount">0</b>)</span>
        </button>
        <button type="button" class="ov-tab" data-tab="write" role="tab" aria-selected="false">
          <i data-lucide="feather"></i><span>Anı Yaz</span>
        </button>
      </div>

      <div class="ov-panel is-active" data-panel="messages">
        <p class="ov-loading" id="gbLoading">Anılar yükleniyor...</p>
        <div class="ov-empty" id="gbEmpty" hidden>
          <span>♡</span>
          <h3>Henüz bir anı bırakılmadı</h3>
          <p>Bu güzel güne ait ilk birkaç satırı siz yazabilirsiniz.</p>
          <button type="button" class="ov-button" data-goto-write>Anı Yaz</button>
        </div>
        <div class="gb-list" id="gbList"></div>
        <p class="ov-foot">♡ İyi ki varsınız...</p>
      </div>

      <div class="ov-panel" data-panel="write">
        <form id="gbForm" novalidate>
          <label class="ov-field">
            <span>İsminiz <b>*</b></span>
            <input type="text" id="gbName" maxlength="80" placeholder="Misafir" required>
          </label>
          <label class="ov-field">
            <span>Güzel mesajınız</span>
            <textarea id="gbMessage" maxlength="500" placeholder="Bu anı defterine yazmak istediğiniz duygularınızı, tebriklerinizi ve anılarınızı buraya aktarabilirsiniz..." required></textarea>
            <small><b id="gbChars">0</b> / 500</small>
          </label>
          <p class="ov-error" id="gbError" role="alert"></p>
          <button type="submit" class="ov-button wide" id="gbSubmit"><i data-lucide="feather"></i> Anıyı Gönder</button>
          <p class="ov-note">♡ Mesajınız gönderildikten sonra hemen yayınlanacaktır.</p>
        </form>
        <div class="ov-success" id="gbSuccess" hidden>
          <span>♥</span>
          <h3>Teşekkürler!</h3>
          <p>Anınız bize ulaştı ve Mesajlar bölümünde yayınlandı.</p>
          <button type="button" class="ov-button" data-goto-messages>Mesajlara Dön</button>
        </div>
      </div>
    </div>
  </section>

  <section class="overlay" id="songRequestSection" hidden aria-label="Şarkı isteği">
    <div class="overlay-shell">
      <button type="button" class="overlay-close" data-close aria-label="Şarkı isteğini kapat">×</button>

      <header class="ov-header">
        <span class="ov-emblem" aria-hidden="true"><i data-lucide="music-2"></i></span>
        <h2>Şarkı İsteği</h2>
        ${divider()}
        <p>Düğünümüzde çalmasını istediğiniz şarkıları bizimle paylaşın.</p>
      </header>

      <form id="songForm" novalidate>
        <label class="ov-field"><span>İsminiz <b>*</b></span>
          <input type="text" id="songName" maxlength="80" placeholder="Adınızı ve soyadınızı yazın" required></label>
        <label class="ov-field"><span>Şarkı adı <b>*</b></span>
          <input type="text" id="songTitle" maxlength="120" placeholder="Şarkının adını yazın" required></label>
        <label class="ov-field"><span>Sanatçı <b>*</b></span>
          <input type="text" id="songArtist" maxlength="120" placeholder="Sanatçının adını yazın" required></label>
        <label class="ov-field"><span>Not <small>(İsteğe bağlı)</small></span>
          <textarea id="songNote" maxlength="200" placeholder="İsteğinizle ilgili bir not bırakabilirsiniz..."></textarea>
          <small><b id="songChars">0</b> / 200</small></label>
        <p class="ov-error" id="songError" role="alert"></p>
        <button type="submit" class="ov-button wide" id="songSubmit"><i data-lucide="music-2"></i> İsteği Gönder</button>
      </form>

      <div class="ov-success" id="songSuccess" hidden>
        <span class="ov-emblem" aria-hidden="true"><i data-lucide="music-2"></i></span>
        <h3>Şarkı isteğin bize ulaştı!</h3>
        ${divider()}
        <p>${esc(c.songSuccess || '')}</p>
        <button type="button" class="ov-button" data-close>İletişim sayfasına dön</button>
      </div>
    </div>
  </section>`;
}

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
        .format(new Date(value))
        .toLocaleUpperCase('tr-TR')
    : '';

function logError(label, error) {
  console.error(label, { message: error?.message, details: error?.details, hint: error?.hint, code: error?.code });
}

const RSVP_MAX_GUESTS = 10;

export function setupOverlays({ onRsvp, preview = false } = {}) {
  readOnly = preview;
  const $ = (s) => document.querySelector(s);

  /* ---------- Ortak aç / kapat ---------- */
  function open(section) {
    section.hidden = false;
    document.body.classList.add('overlay-open');
    section.querySelector('.overlay-shell').scrollTop = 0;
  }

  function close(section) {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    section.hidden = true;
    document.body.classList.remove('overlay-open');
    section.dispatchEvent(new Event('overlay:closed'));
  }

  document.querySelectorAll('.overlay').forEach((section) => {
    section.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => close(section)));
    // Formdayken klavye tuşları sayfa geçişini tetiklemesin
    section.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close(section);
      e.stopPropagation();
    });
  });

  /* ---------- LCV (katılım durumu) ---------- */
  const rsvp = $('#rsvpSection');
  const rsvpTabs = rsvp.querySelectorAll('[data-rsvp]');
  const rsvpForm = $('#rsvpForm');
  const rsvpName = $('#rsvpName');
  const rsvpGuestsField = $('#rsvpGuestsField');
  const rsvpGuests = $('#rsvpGuests');
  const rsvpNote = $('#rsvpNote');
  const rsvpError = $('#rsvpError');
  const rsvpSubmit = $('#rsvpSubmit');
  let attending = true;
  let guests = 1;

  function setAttending(value) {
    attending = value;
    rsvpTabs.forEach((t) => {
      const on = (t.dataset.rsvp === 'yes') === value;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-checked', String(on));
    });
    rsvpGuestsField.hidden = !value;
    rsvpError.textContent = '';
  }

  function setGuests(n) {
    guests = Math.min(RSVP_MAX_GUESTS, Math.max(1, n));
    rsvpGuests.textContent = String(guests);
  }

  rsvpTabs.forEach((t) => t.addEventListener('click', () => setAttending(t.dataset.rsvp === 'yes')));
  rsvp.querySelectorAll('[data-step]').forEach((b) =>
    b.addEventListener('click', () => setGuests(guests + Number(b.dataset.step)))
  );

  // Sayfadaki "Orada olacağım / Gelemiyorum" butonları bunu çağırır
  function openRsvp(isAttending, previous = {}) {
    setAttending(isAttending);
    setGuests(previous.guests || 1);
    if (previous.name && !rsvpName.value) rsvpName.value = previous.name;
    open(rsvp);
    window.setTimeout(() => rsvpName.focus({ preventScroll: true }), 200);
  }

  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = rsvpName.value.trim();
    const note = rsvpNote.value.trim();

    if (!name) { rsvpError.textContent = 'Lütfen isminizi yazın.'; rsvpName.focus(); return; }

    rsvpError.textContent = '';
    rsvpSubmit.disabled = true;
    rsvpSubmit.classList.add('is-loading');

    const answer = { name, attending, guests: attending ? guests : 0 };

    try {
      const { error: err } = await db('rsvp_responses').insert({
        name,
        attending,
        guest_count: answer.guests,
        note: note || null
      });
      if (err) throw err;

      rsvpNote.value = '';
      close(rsvp);
      onRsvp?.(answer);
    } catch (err) {
      logError('LCV kaydedilemedi:', err);
      rsvpError.textContent = 'Yanıtınız kaydedilemedi. Lütfen biraz sonra tekrar deneyin.';
    } finally {
      rsvpSubmit.disabled = false;
      rsvpSubmit.classList.remove('is-loading');
    }
  });

  /* ---------- Anı defteri ---------- */
  const gb = $('#guestbookSection');
  const tabs = gb.querySelectorAll('[data-tab]');
  const panels = gb.querySelectorAll('[data-panel]');
  const form = $('#gbForm');
  const nameInput = $('#gbName');
  const msgInput = $('#gbMessage');
  const chars = $('#gbChars');
  const error = $('#gbError');
  const submit = $('#gbSubmit');
  const loading = $('#gbLoading');
  const empty = $('#gbEmpty');
  const list = $('#gbList');
  const count = $('#gbCount');
  const success = $('#gbSuccess');

  function setTab(name) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === name));
    if (name === 'messages') loadMessages();
    else window.setTimeout(() => nameInput.focus({ preventScroll: true }), 150);
  }

  async function loadMessages() {
    loading.hidden = false;
    loading.textContent = 'Anılar yükleniyor...';
    empty.hidden = true;
    list.innerHTML = '';

    try {
      const { data, error: err } = await db('guestbook_messages')
        .select('id, name, message, created_at')
        .order('created_at', { ascending: false });
      if (err) throw err;

      const messages = data || [];
      count.textContent = String(messages.length);
      loading.hidden = true;
      empty.hidden = messages.length > 0;

      list.innerHTML = messages
        .map(
          (m) => `
          <article class="gb-card">
            <p>${esc(m.message || '')}</p>
            <div class="gb-meta"><span>— ${esc(m.name || 'Misafir')}</span><time>${formatDate(m.created_at)}</time></div>
          </article>`
        )
        .join('');
    } catch (err) {
      console.error('Anılar yüklenemedi:', err);
      loading.textContent = 'Anılar şu anda yüklenemedi. Lütfen biraz sonra tekrar deneyin.';
    }
  }

  // Yetkilendirme: düğme yeniden çizilse de (editör önizlemesi) çalışır
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#openGuestbook')) return;
    open(gb);
    setTab('messages');
  });

  tabs.forEach((t) => t.addEventListener('click', () => setTab(t.dataset.tab)));
  gb.querySelector('[data-goto-write]').addEventListener('click', () => setTab('write'));
  gb.querySelector('[data-goto-messages]').addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    setTab('messages');
  });

  gb.addEventListener('overlay:closed', () => {
    success.hidden = true;
    form.hidden = false;
    error.textContent = '';
    setTab('messages');
  });

  msgInput.addEventListener('input', () => {
    chars.textContent = String(msgInput.value.length);
    error.textContent = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();

    if (!name) { error.textContent = 'Lütfen isminizi yazın.'; nameInput.focus(); return; }
    if (!message) { error.textContent = 'Lütfen anınızı veya güzel dileğinizi yazın.'; msgInput.focus(); return; }

    error.textContent = '';
    submit.disabled = true;
    submit.classList.add('is-loading');

    try {
      const { error: err } = await db('guestbook_messages').insert({ name, message, is_approved: true });
      if (err) throw err;
      form.reset();
      chars.textContent = '0';
      form.hidden = true;
      success.hidden = false;
    } catch (err) {
      logError('Anı kaydedilemedi:', err);
      error.textContent = 'Mesajınız kaydedilemedi. Lütfen biraz sonra tekrar deneyin.';
    } finally {
      submit.disabled = false;
      submit.classList.remove('is-loading');
    }
  });

  /* ---------- Şarkı isteği ---------- */
  const song = $('#songRequestSection');
  const songForm = $('#songForm');
  const songName = $('#songName');
  const songTitle = $('#songTitle');
  const songArtist = $('#songArtist');
  const songNote = $('#songNote');
  const songChars = $('#songChars');
  const songError = $('#songError');
  const songSubmit = $('#songSubmit');
  const songSuccess = $('#songSuccess');

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#openSongRequest')) return;
    songForm.hidden = false;
    songSuccess.hidden = true;
    open(song);
  });

  song.addEventListener('overlay:closed', () => {
    songForm.reset();
    songChars.textContent = '0';
    songError.textContent = '';
    songForm.hidden = false;
    songSuccess.hidden = true;
  });

  songNote.addEventListener('input', () => {
    songChars.textContent = String(songNote.value.length);
    songError.textContent = '';
  });

  songForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = songName.value.trim();
    const title = songTitle.value.trim();
    const artist = songArtist.value.trim();
    const note = songNote.value.trim();

    if (!name) { songError.textContent = 'Lütfen isminizi yazın.'; songName.focus(); return; }
    if (!title) { songError.textContent = 'Lütfen şarkı adını yazın.'; songTitle.focus(); return; }
    if (!artist) { songError.textContent = 'Lütfen sanatçı adını yazın.'; songArtist.focus(); return; }

    songError.textContent = '';
    songSubmit.disabled = true;
    songSubmit.classList.add('is-loading');

    try {
      const { error: err } = await db('song_requests')
        .insert({ name, song_title: title, artist, note: note || null });
      if (err) throw err;
      songForm.reset();
      songChars.textContent = '0';
      songForm.hidden = true;
      songSuccess.hidden = false;
    } catch (err) {
      logError('Şarkı isteği kaydedilemedi:', err);
      songError.textContent = 'Şarkı isteğiniz kaydedilemedi. Lütfen biraz sonra tekrar deneyin.';
    } finally {
      songSubmit.disabled = false;
      songSubmit.classList.remove('is-loading');
    }
  });

  return { openRsvp };
}

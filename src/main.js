import './css/style.css';
import gsap from 'gsap';
import {
  createIcons,
  Phone,
  MessageCircle,
  BookOpen,
  Music2,
  User,
  Feather
} from 'lucide';
import { supabase } from './supabase.js';
import closedImg from './assets/envelope/closed.png';
import openImg from './assets/envelope/open.png';
import paperImg from './assets/envelope/paper.png';
import invitationImg from './assets/envelope/invitation.png';
import maskImg from './assets/envelope/mask.png';
import weddingSong from './assets/audio/weddingsong.mp3';
import weddingVideo from './assets/video/wedding-background.mp4';

document.querySelector('#app').innerHTML = `


<div class="site-loader" id="siteLoader" aria-live="polite">
  <div class="site-loader-inner">
    <div class="site-loader-monogram">E & T</div>
    <div class="site-loader-line">
      <span></span>
    </div>
    <p>Davetiyeniz hazırlanıyor...</p>
  </div>
</div>

<div class="wedding-video-background" id="weddingVideoBackground">
<video
  id="weddingBackgroundVideo"
  src="${weddingVideo}"
  autoplay
  muted
  loop
  playsinline
  webkit-playsinline
  preload="auto"
  disablepictureinpicture
  controlslist="nodownload noplaybackrate nofullscreen"
  aria-hidden="true">
</video>

  <div class="wedding-video-overlay"></div>
</div>

<section class="intro" id="intro">

  <p class="eyebrow">BİR HABERİMİZ VAR</p>

  <div class="scene" id="scene">
    <img src="${openImg}" class="envelope opened" />
    <img src="${paperImg}" class="paper" />
    <img src="${maskImg}" class="mask" />
    <img src="${closedImg}" class="envelope closed" />

    <button class="seal" id="seal" aria-label="Mühüre dokun"></button>
  </div>

  <p class="tap-text">MÜHÜRE DOKUNUN</p>
</section>

<div class="paper-full" id="paperFull">
  <div class="invitation-stage" id="invitationStage">
    <div class="invitation-glass">
      <img
        src="${invitationImg}"
        class="real-invitation"
        id="realInvitation"
        alt="Elçin ve Talha düğün davetiyesi"
      />
    </div>
  </div>

  <div class="section-nav bottom">
    <p class="scroll-text"></p>
    <button class="nav-arrow" data-target="countdown" aria-label="Geri sayıma geç">⌄</button>
  </div>
</div>

<section class="countdown" id="countdown">
  <div class="section-nav top">
    <button class="nav-arrow" data-target="paperFull" aria-label="Davet sayfasına dön">⌃</button>
  </div>

  <div class="countdown-inner">
    <div class="event-block">
      <h3>NİKAH</h3>
      <p class="event-date">22 Ağustos 2026</p>

      <div class="countdown-wrapper" id="nikahCountdown">
        <div class="counter-card"><strong id="nikah-days"></strong><small>GÜN</small></div>
        <div class="counter-card"><strong id="nikah-hours"></strong><small>SAAT</small></div>
        <div class="counter-card"><strong id="nikah-minutes"></strong><small>DK</small></div>
        <div class="counter-card"><strong id="nikah-seconds"></strong><small>SN</small></div>
      </div>
    </div>

    <div class="middle-divider">♥</div>

    <div class="event-block">
      <h3>DÜĞÜN</h3>
      <p class="event-date">29 Ağustos 2026</p>

      <div class="countdown-wrapper" id="dugunCountdown">
        <div class="counter-card"><strong id="dugun-days"></strong><small>GÜN</small></div>
        <div class="counter-card"><strong id="dugun-hours"></strong><small>SAAT</small></div>
        <div class="counter-card"><strong id="dugun-minutes"></strong><small>DK</small></div>
        <div class="counter-card"><strong id="dugun-seconds"></strong><small>SN</small></div>
      </div>
    </div>
  </div>

  <div class="section-nav bottom">
    <button class="nav-arrow" data-target="locationsSection" aria-label="Mekanlara geç">⌄</button>
  </div>
</section>

<section class="locations-section" id="locationsSection">
  <div class="section-nav top">
    <button class="nav-arrow" data-target="countdown" aria-label="Geri sayıma dön">⌃</button>
  </div>

  <div class="locations-content">
    <h2>Lokasyon</h2>

    <div class="location-list">
      <article class="location-card">
        <div class="location-heading">
          <div>
            <p class="location-type">NİKAH</p>
            <h3>Maltepe Belediyesi<br>Cumhuriyet Kültür Merkezi</h3>
            <p class="location-city">İstanbul · Maltepe</p>
          </div>
        </div>

        <div class="map-frame">
          <iframe
            src="https://www.google.com/maps?q=Maltepe%20Belediyesi%20Cumhuriyet%20K%C3%BClt%C3%BCr%20Merkezi&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Maltepe Belediyesi Cumhuriyet Kültür Merkezi haritası">
          </iframe>
        </div>

        <a
          class="directions-button"
          href="https://www.google.com/maps/dir/?api=1&destination=Maltepe+Belediyesi+Cumhuriyet+K%C3%BClt%C3%BCr+Merkezi"
          target="_blank"
          rel="noopener noreferrer">
          Yol Tarifi Al
        </a>
      </article>

      <div class="location-divider">
        <span>♥</span>
      </div>

      <article class="location-card">
        <div class="location-heading">
          <div>
            <p class="location-type">DÜĞÜN</p>
            <h3>Flamingo Event Hall</h3>
            <p class="location-city">Manisa · Salihli</p>
          </div>
        </div>

        <div class="map-frame">
          <iframe
            src="https://www.google.com/maps?q=Flamingo%20Event%20Hall%20Salihli%20Manisa&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Flamingo Event Hall haritası">
          </iframe>
        </div>

        <a
          class="directions-button"
          href="https://www.google.com/maps/dir/?api=1&destination=Flamingo+Event+Hall+Salihli+Manisa"
          target="_blank"
          rel="noopener noreferrer">
          Yol Tarifi Al
        </a>
      </article>
    </div>
  </div>

  <div class="section-nav bottom">
    <button class="nav-arrow" data-target="reminderSection" aria-label="Hatırlatma ve notlara geç">⌄</button>
  </div>
</section>

<section class="reminder-section" id="reminderSection">
  <div class="section-nav top">
    <button class="nav-arrow" data-target="locationsSection" aria-label="Lokasyon sayfasına dön">⌃</button>
  </div>

  <div class="reminder-card">
    <div class="reminder-tape" aria-hidden="true"></div>

    <h2>Hatırlatma ve Notlar</h2>

    <div class="reminder-divider">
      <span></span>
      <b>♥</b>
      <span></span>
    </div>

    <p class="reminder-text">
      10 Ağustos tarihine kadar<br>
      katılım durumunuzu belirtmenizi rica ederiz.
    </p>
  </div>

  <div class="section-nav bottom">
    <button class="nav-arrow" data-target="contactSection" aria-label="İletişim sayfasına geç">⌄</button>
  </div>
</section>

<section class="contact-section" id="contactSection">
  <div class="section-nav top">
    <button class="nav-arrow" data-target="reminderSection" aria-label="Hatırlatma ve notlara dön">⌃</button>
  </div>

  <div class="contact-content">

    <div class="contact-list">
      <article class="contact-card">
        <div class="contact-person">
          <p>İLETİŞİM KİŞİSİ</p>
          <h3>Elçin</h3>
        </div>

        <div class="contact-actions">
          <a
            class="contact-action"
            href="tel:+905458494585"
            aria-label="Elçin'i ara">
            <i data-lucide="phone"></i>
          </a>

          <a
            class="contact-action whatsapp"
            href="https://wa.me/905458494585"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Elçin'e WhatsApp'tan yaz">
            <i data-lucide="message-circle"></i>
          </a>
        </div>
      </article>

      <article class="contact-card">
        <div class="contact-person">
          <p>İLETİŞİM KİŞİSİ</p>
          <h3>Talha</h3>
        </div>

        <div class="contact-actions">
          <a
            class="contact-action"
            href="tel:+905526754507"
            aria-label="Talha'yı ara">
            <i data-lucide="phone"></i>
          </a>

          <a
            class="contact-action whatsapp"
            href="https://wa.me/905526754507"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Talha'ya WhatsApp'tan yaz">
            <i data-lucide="message-circle"></i>
          </a>
        </div>
      </article>
    </div>

    <div class="contact-extras">
      <button
        type="button"
        class="contact-extra-button"
        id="openGuestbook"
        aria-label="Anı defterini aç">

        <span class="contact-extra-icon">
          <i data-lucide="book-open"></i>
        </span>

        <span class="contact-extra-text">
          <strong>Anı Defteri</strong>
          <small>Güzel dileklerini bırak</small>
        </span>
      </button>

      <span class="contact-extra-heart" aria-hidden="true">♥</span>

      <button
        type="button"
        class="contact-extra-button"
        id="openSongRequest"
        aria-label="Şarkı isteği bırak">

        <span class="contact-extra-icon">
          <i data-lucide="music-2"></i>
        </span>

        <span class="contact-extra-text">
          <strong>Şarkı İsteği</strong>
          <small>Bizim için bir şarkı iste</small>
        </span>
      </button>
    </div>
  </div>

</section>

<section class="guestbook-section" id="guestbookSection" hidden>
  <div class="guestbook-page-shell">
    <button
      type="button"
      class="guestbook-close-button"
      id="closeGuestbook"
      aria-label="Anı defterini kapat">
      ×
    </button>

    <div class="guestbook-header">
      <div class="guestbook-header-emblem" aria-hidden="true">
        <i data-lucide="feather"></i>
      </div>

      <h2>Anı Defterimiz</h2>

      <div class="guestbook-title-divider">
        <span></span>
        <b>♡</b>
        <span></span>
      </div>

      <p>
        Bu özel günde bizimle paylaştığınız dilekler,
        yıllar sonra bile gülümsetecek en değerli hatıralarımız olacak.
      </p>
    </div>

    <div class="guestbook-tabs" role="tablist" aria-label="Anı defteri sekmeleri">
      <button
        type="button"
        class="guestbook-tab is-active"
        id="guestbookMessagesTab"
        data-guestbook-tab="messages"
        role="tab"
        aria-selected="true">
        <i data-lucide="message-circle"></i>
        <span>Mesajlar (<b id="visibleMessageCount">0</b>)</span>
      </button>

      <button
        type="button"
        class="guestbook-tab"
        id="guestbookWriteTab"
        data-guestbook-tab="write"
        role="tab"
        aria-selected="false">
        <i data-lucide="feather"></i>
        <span>Anı Yaz</span>
      </button>
    </div>

    <div class="guestbook-panel is-active" id="guestbookMessagesPanel" data-guestbook-panel="messages">
      <div class="guestbook-section-caption">
        <span></span>
        <p>♡ Sizlerden Gelenler</p>
        <span></span>
      </div>

      <div class="guestbook-loading" id="guestbookLoading">
        Anılar yükleniyor...
      </div>

      <div class="guestbook-empty" id="guestbookEmpty" hidden>
        <span>♡</span>
        <h3>Henüz bir anı bırakılmadı</h3>
        <p>Bu güzel güne ait ilk birkaç satırı siz yazabilirsiniz.</p>
        <button type="button" id="emptyWriteButton">Anı Yaz</button>
      </div>

      <div class="guestbook-message-list" id="guestbookMessageList"></div>

      <p class="guestbook-footer-note">♡ İyi ki varsınız...</p>
    </div>

    <div class="guestbook-panel" id="guestbookWritePanel" data-guestbook-panel="write">
      <div class="guestbook-write-heading">
        <i data-lucide="feather"></i>

        <div>
          <h3>Anı Defterine Yaz</h3>
          <p>Sevdikleriniz için bir iz bırakın</p>
        </div>
      </div>

      <form id="guestbookForm" novalidate>
        <label class="guestbook-field">
          <span>İsminiz <b>*</b></span>
          <input
            type="text"
            id="guestName"
            name="name"
            maxlength="80"
            placeholder="Misafir"
            required>
        </label>

        <label class="guestbook-field">
          <span>Güzel mesajınız</span>

          <div class="guestbook-message-box">
            <textarea
              id="guestMessage"
              name="message"
              maxlength="500"
              placeholder="Bu anı defterine yazmak istediğiniz duygularınızı, tebriklerinizi ve anılarınızı buraya aktarabilirsiniz..."
              required></textarea>

            <small><b id="messageCount">0</b> / 500</small>
          </div>
        </label>

        <p class="guestbook-error" id="guestbookError" role="alert"></p>

        <button type="submit" class="guestbook-submit-button" id="guestbookSubmit">
          <span class="guestbook-submit-label">
            <i data-lucide="feather"></i>
            Anıyı Gönder
          </span>
          <span class="guestbook-submit-loading" aria-hidden="true"></span>
        </button>

        <p class="guestbook-approval-note">
          ♡ Mesajınız gönderildikten sonra hemen yayınlanacaktır.
        </p>
      </form>

      <div class="guestbook-success-inline" id="guestbookSuccessInline" hidden>
        <span>♥</span>
        <h3>Teşekkürler!</h3>
        <p>Anınız bize ulaştı ve Mesajlar bölümünde yayınlandı.</p>
        <button type="button" id="showMessagesAfterSubmit">Mesajlara Dön</button>
      </div>
    </div>
  </div>
</section>

<section class="song-request-section" id="songRequestSection" hidden>
  <div class="song-request-shell">
    <button
      type="button"
      class="song-request-close"
      id="closeSongRequest"
      aria-label="Şarkı isteğini kapat">
      ×
    </button>

    <div class="song-request-header">
      <div class="song-request-icon" aria-hidden="true">
        <i data-lucide="music-2"></i>
      </div>

      <h2>Şarkı İsteği</h2>

      <div class="song-request-divider">
        <span></span>
        <b>♥</b>
        <span></span>
      </div>

      <p>
        Düğünümüzde çalmasını istediğiniz şarkıları
        bizimle paylaşın.
      </p>
    </div>

    <form id="songRequestForm" novalidate>
      <label class="song-request-field">
        <span>İsminiz <b>*</b></span>
        <input
          type="text"
          id="songGuestName"
          name="name"
          maxlength="80"
          placeholder="Adınızı ve soyadınızı yazın"
          required>
      </label>

      <label class="song-request-field">
        <span>Şarkı adı <b>*</b></span>
        <input
          type="text"
          id="songTitle"
          name="song_title"
          maxlength="120"
          placeholder="Şarkının adını yazın"
          required>
      </label>

      <label class="song-request-field">
        <span>Sanatçı <b>*</b></span>
        <input
          type="text"
          id="songArtist"
          name="artist"
          maxlength="120"
          placeholder="Sanatçının adını yazın"
          required>
      </label>

      <label class="song-request-field">
        <span>Not <small>(İsteğe bağlı)</small></span>

        <div class="song-request-textarea-wrap">
          <textarea
            id="songNote"
            name="note"
            maxlength="200"
            placeholder="İsteğinizle ilgili bir not bırakabilirsiniz..."></textarea>

          <small><b id="songNoteCount">0</b> / 200</small>
        </div>
      </label>

      <p class="song-request-error" id="songRequestError" role="alert"></p>

      <button
        type="submit"
        class="song-request-submit"
        id="songRequestSubmit">
        <span class="song-request-submit-label">
          <i data-lucide="music-2"></i>
          İsteği Gönder
        </span>
        <span class="song-request-loading" aria-hidden="true"></span>
      </button>
    </form>

    <div class="song-request-success" id="songRequestSuccess" hidden>
      <div class="song-request-success-icon" aria-hidden="true">
        <i data-lucide="music-2"></i>
      </div>

      <h3>Şarkı isteğin bize ulaştı!</h3>

      <div class="song-request-divider">
        <span></span>
        <b>♥</b>
        <span></span>
      </div>

      <p>
        Manisa’da bu şarkıyı çalmak için sabırsızlanıyoruz. ♫
      </p>

      <button type="button" id="closeSongSuccess">
        İletişim sayfasına dön
      </button>
    </div>
  </div>
</section>
<div class="music-player" id="musicPlayer">
  <div
    class="music-notes"
    id="musicNotes"
    aria-hidden="true">
  </div>

  <button
    class="music-toggle"
    id="musicToggle"
    type="button"
    aria-label="Müziği çal"
    aria-pressed="false">

    <span class="music-main-note" aria-hidden="true">♪</span>
  </button>

  <audio
    id="backgroundMusic"
    src="${weddingSong}"
    preload="metadata"
    loop>
  </audio>
</div>
`;


/* ===================== */
/* SAYFA / ASSET YÜKLEME EKRANI */
/* ===================== */

const siteLoader = document.querySelector('#siteLoader');
const loaderProgress = document.querySelector('.site-loader-line span');

function waitForImage(imageElement) {
  if (!imageElement) return Promise.resolve();

  if (imageElement.complete && imageElement.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => resolve();

    imageElement.addEventListener('load', finish, { once: true });
    imageElement.addEventListener('error', finish, { once: true });

    window.setTimeout(finish, 8000);
  });
}

function waitForVideo(videoElement) {
  if (!videoElement) return Promise.resolve();

  if (videoElement.readyState >= 2) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => resolve();

    videoElement.addEventListener('loadeddata', finish, { once: true });
    videoElement.addEventListener('canplay', finish, { once: true });
    videoElement.addEventListener('error', finish, { once: true });

    window.setTimeout(finish, 9000);
  });
}

function waitForFonts() {
  if (!document.fonts?.ready) {
    return Promise.resolve();
  }

  return Promise.race([
    document.fonts.ready,
    new Promise((resolve) => window.setTimeout(resolve, 5000))
  ]);
}

async function revealLoadedSite() {
  const criticalImages = [
    document.querySelector('.closed'),
    document.querySelector('.opened'),
    document.querySelector('.paper'),
    document.querySelector('.mask'),
    document.querySelector('#realInvitation')
  ];

  const criticalTasks = [
    ...criticalImages.map(waitForImage),
    waitForVideo(document.querySelector('#weddingBackgroundVideo')),
    waitForFonts()
  ];

  let finishedCount = 0;
  const totalCount = criticalTasks.length;

  criticalTasks.forEach((task) => {
    Promise.resolve(task).finally(() => {
      finishedCount += 1;

      if (loaderProgress) {
        loaderProgress.style.width =
          `${Math.round((finishedCount / totalCount) * 100)}%`;
      }
    });
  });

  await Promise.allSettled(criticalTasks);

  document.body.classList.add('site-ready');

  window.requestAnimationFrame(() => {
    siteLoader?.classList.add('is-hidden');

    window.setTimeout(() => {
      siteLoader?.remove();
    }, 700);
  });
}

window.addEventListener('load', revealLoadedSite, { once: true });

window.setTimeout(() => {
  if (!document.body.classList.contains('site-ready')) {
    revealLoadedSite();
  }
}, 10000);


/* Lucide ikonlarını HTML oluşturulduktan sonra SVG'ye çevirir */
createIcons({
  icons: {
    Phone,
    MessageCircle,
    BookOpen,
    Music2,
    User,
    Feather
  },
  attrs: {
    'stroke-width': 1.7,
    width: 23,
    height: 23
  }
});
/* ===================== */
/* MÜZİK BUTONU */
/* ===================== */

const backgroundMusic = document.querySelector('#backgroundMusic');
const musicToggle = document.querySelector('#musicToggle');
const musicNotes = document.querySelector('#musicNotes');
let musicIsPlaying = false;
let noteTimer = null;

const noteSymbols = ['♪', '♫', '♩', '♬'];

function createFloatingNote() {
  if (!musicIsPlaying || !musicNotes) return;

  const note = document.createElement('span');
  note.className = 'floating-note';
  note.textContent =
    noteSymbols[Math.floor(Math.random() * noteSymbols.length)];

  note.style.left = `${4 + Math.random() * 46}px`;
  note.style.bottom = `${Math.random() * 14}px`;

  note.style.setProperty(
    '--note-x',
    `${Math.round(Math.random() * 54 - 27)}px`
  );

  note.style.setProperty(
    '--note-rotate',
    `${Math.round(Math.random() * 34 - 17)}deg`
  );

  note.style.setProperty(
    '--note-duration',
    `${(2.8 + Math.random() * 1.2).toFixed(2)}s`
  );

  note.style.setProperty(
    '--note-size',
    `${Math.round(17 + Math.random() * 10)}px`
  );

  musicNotes.appendChild(note);

  note.addEventListener(
    'animationend',
    () => note.remove(),
    { once: true }
  );
}

function createNoteGroup() {
  createFloatingNote();

  window.setTimeout(() => {
    createFloatingNote();
  }, 300);

  window.setTimeout(() => {
    createFloatingNote();
  }, 600);
}

function startNoteAnimation() {
  if (noteTimer) return;

  createNoteGroup();

  noteTimer = window.setInterval(() => {
    createNoteGroup();
  }, 1700);
}

function stopNoteAnimation() {
  window.clearInterval(noteTimer);
  noteTimer = null;

  musicNotes?.replaceChildren();
}

function updateMusicButton(isPlaying) {
  musicIsPlaying = isPlaying;

  musicToggle?.classList.toggle('is-playing', isPlaying);

  musicToggle?.setAttribute(
    'aria-pressed',
    String(isPlaying)
  );

  musicToggle?.setAttribute(
    'aria-label',
    isPlaying ? 'Müziği durdur' : 'Müziği çal'
  );

  if (isPlaying) {
    startNoteAnimation();
  } else {
    stopNoteAnimation();
  }
}

async function playWeddingMusic() {
  if (!backgroundMusic) return;

  try {
    backgroundMusic.volume = 0.42;

    await backgroundMusic.play();

    updateMusicButton(true);
  } catch (error) {
    console.info(
      'Müzik kullanıcı etkileşimi bekliyor.',
      error
    );

    updateMusicButton(false);
  }
}

musicToggle?.addEventListener('click', async () => {
  if (!backgroundMusic) return;

  if (backgroundMusic.paused) {
    await playWeddingMusic();
  } else {
    backgroundMusic.pause();
    updateMusicButton(false);
  }
});

backgroundMusic?.addEventListener('play', () => {
  updateMusicButton(true);
});

backgroundMusic?.addEventListener('pause', () => {
  updateMusicButton(false);
});


let musicWasPlayingBeforeHide = false;

function pauseMusicWhenPageHidden() {
  if (!backgroundMusic || backgroundMusic.paused) return;

  musicWasPlayingBeforeHide = true;
  backgroundMusic.pause();
  updateMusicButton(false);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseMusicWhenPageHidden();
    return;
  }

  if (musicWasPlayingBeforeHide) {
    musicWasPlayingBeforeHide = false;

    playWeddingMusic().catch(() => {
      // Safari tekrar otomatik oynatmaya izin vermezse
      // kullanıcı müzik butonuna dokunarak devam ettirebilir.
    });
  }
});

window.addEventListener('pagehide', pauseMusicWhenPageHidden);
/* ===================== */
/* iOS / MOBİL ARKA PLAN VİDEOSU */
/* ===================== */

let backgroundVideoStarting = false;

async function startBackgroundVideo() {
  if (!weddingBackgroundVideo || backgroundVideoStarting) return;

  backgroundVideoStarting = true;

  weddingBackgroundVideo.muted = true;
  weddingBackgroundVideo.defaultMuted = true;
  weddingBackgroundVideo.playsInline = true;
  weddingBackgroundVideo.loop = true;

  weddingBackgroundVideo.setAttribute('muted', '');
  weddingBackgroundVideo.setAttribute('autoplay', '');
  weddingBackgroundVideo.setAttribute('playsinline', '');
  weddingBackgroundVideo.setAttribute('webkit-playsinline', '');

  try {
    if (weddingBackgroundVideo.readyState < 2) {
      weddingBackgroundVideo.load();
    }

    await weddingBackgroundVideo.play();
  } catch (error) {
    console.info('Arka plan videosu ilk etkileşimi bekliyor.', error);
  } finally {
    backgroundVideoStarting = false;
  }
}

function resumeBackgroundVideo() {
  if (!weddingBackgroundVideo) return;

  if (
    weddingBackgroundVideo.paused ||
    weddingBackgroundVideo.ended ||
    weddingBackgroundVideo.readyState < 2
  ) {
    startBackgroundVideo();
  }
}


window.addEventListener('load', startBackgroundVideo);
window.addEventListener('pageshow', startBackgroundVideo);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    window.setTimeout(startBackgroundVideo, 80);
  }
});

/*
 * iOS Safari/Chrome bazı koşullarda otomatik oynatmayı reddeder.
 * İlk gerçek kullanıcı etkileşiminde video sessiz ve inline olarak başlatılır.
 */
['touchstart', 'pointerdown', 'click'].forEach((eventName) => {
  document.addEventListener(
    eventName,
    startBackgroundVideo,
    { once: true, passive: true, capture: true }
  );
});


/* ===================== */
/* GERÇEK MOBİL EKRAN YÜKSEKLİĞİ */
/* ===================== */

function updateResponsiveViewport() {
  const viewportHeight =
    window.visualViewport?.height ||
    window.innerHeight ||
    document.documentElement.clientHeight;

  document.documentElement.style.setProperty(
    '--app-viewport-height',
    `${Math.round(viewportHeight)}px`
  );

  document.body.classList.toggle(
    'keyboard-open',
    window.innerHeight - viewportHeight > 150
  );

}

updateResponsiveViewport();

window.addEventListener('resize', updateResponsiveViewport, {
  passive: true
});

window.addEventListener('orientationchange', () => {
  window.setTimeout(updateResponsiveViewport, 120);
});

window.visualViewport?.addEventListener(
  'resize',
  updateResponsiveViewport,
  { passive: true }
);

window.visualViewport?.addEventListener(
  'scroll',
  updateResponsiveViewport,
  { passive: true }
);

const guestbookButton = document.querySelector('#openGuestbook');
const songRequestButton = document.querySelector('#openSongRequest');
const guestbookSection = document.querySelector('#guestbookSection');
const closeGuestbookButton = document.querySelector('#closeGuestbook');
const guestbookTabs = document.querySelectorAll('[data-guestbook-tab]');
const guestbookPanels = document.querySelectorAll('[data-guestbook-panel]');
const guestbookForm = document.querySelector('#guestbookForm');
const guestNameInput = document.querySelector('#guestName');
const guestMessageInput = document.querySelector('#guestMessage');
const messageCount = document.querySelector('#messageCount');
const visibleMessageCount = document.querySelector('#visibleMessageCount');
const guestbookError = document.querySelector('#guestbookError');
const guestbookSubmit = document.querySelector('#guestbookSubmit');
const guestbookLoading = document.querySelector('#guestbookLoading');
const guestbookEmpty = document.querySelector('#guestbookEmpty');
const guestbookMessageList = document.querySelector('#guestbookMessageList');
const guestbookSuccessInline = document.querySelector('#guestbookSuccessInline');
const emptyWriteButton = document.querySelector('#emptyWriteButton');
const showMessagesAfterSubmit = document.querySelector('#showMessagesAfterSubmit');

[guestNameInput, guestMessageInput].forEach((field) => {
  field?.addEventListener('keydown', (event) => {
    event.stopPropagation();
  });
});

function goToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function setGuestbookTab(tabName) {
  guestbookTabs.forEach((tab) => {
    const isActive = tab.dataset.guestbookTab === tabName;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  guestbookPanels.forEach((panel) => {
    panel.classList.toggle(
      'is-active',
      panel.dataset.guestbookPanel === tabName
    );
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatGuestbookDate(value) {
  if (!value) return '';

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value)).toLocaleUpperCase('tr-TR');
}

async function loadVisibleGuestbookMessages() {
  guestbookLoading.hidden = false;
  guestbookEmpty.hidden = true;
  guestbookMessageList.innerHTML = '';

  try {
    const { data, error } = await supabase
      .from('guestbook_messages')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const messages = data || [];
    visibleMessageCount.textContent = String(messages.length);
    guestbookLoading.hidden = true;

    if (!messages.length) {
      guestbookEmpty.hidden = false;
      return;
    }

    guestbookMessageList.innerHTML = messages.map((item) => {
      const safeName = escapeHtml(item.name || 'Misafir');
      const safeMessage = escapeHtml(item.message || '');
      const safeDate = formatGuestbookDate(item.created_at);

      return `
        <article class="guestbook-message-card">
          <p class="guestbook-message-text">${safeMessage}</p>

          <div class="guestbook-message-meta">
            <span>— ${safeName}</span>
            <time>${safeDate}</time>
          </div>
        </article>
      `;
    }).join('');
  } catch (error) {
    console.error('Anılar yüklenemedi:', error);
    guestbookLoading.textContent =
      'Anılar şu anda yüklenemedi. Lütfen biraz sonra tekrar deneyin.';
  }
}

async function openGuestbook(defaultTab = 'messages') {
  guestbookSection.hidden = false;
  document.body.classList.add('overlay-open');
  setGuestbookTab(defaultTab);

  if (defaultTab === 'messages') {
    await loadVisibleGuestbookMessages();
  }
}

function closeGuestbook() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  guestbookSection.hidden = true;
  document.body.classList.remove('overlay-open');

  setGuestbookTab('messages');

  guestbookSuccessInline.hidden = true;
  guestbookForm.hidden = false;

  goToContactSection();
}

guestbookButton?.addEventListener('click', () => {
  openGuestbook('messages');
});

closeGuestbookButton?.addEventListener('click', closeGuestbook);

guestbookTabs.forEach((tab) => {
  tab.addEventListener('click', async () => {
    const tabName = tab.dataset.guestbookTab;
    setGuestbookTab(tabName);

    if (tabName === 'messages') {
      await loadVisibleGuestbookMessages();
    }
  });
});

emptyWriteButton?.addEventListener('click', () => {
  setGuestbookTab('write');
});

showMessagesAfterSubmit?.addEventListener('click', async () => {
  guestbookSuccessInline.hidden = true;
  guestbookForm.hidden = false;
  setGuestbookTab('messages');
  await loadVisibleGuestbookMessages();
});

const songRequestSection = document.querySelector('#songRequestSection');
const closeSongRequestButton = document.querySelector('#closeSongRequest');
const songRequestForm = document.querySelector('#songRequestForm');
const songGuestNameInput = document.querySelector('#songGuestName');
const songTitleInput = document.querySelector('#songTitle');
const songArtistInput = document.querySelector('#songArtist');
const songNoteInput = document.querySelector('#songNote');
const songNoteCount = document.querySelector('#songNoteCount');
const songRequestError = document.querySelector('#songRequestError');
const songRequestSubmit = document.querySelector('#songRequestSubmit');
const songRequestSuccess = document.querySelector('#songRequestSuccess');
const closeSongSuccessButton = document.querySelector('#closeSongSuccess');

function openSongRequest() {
  songRequestSection.hidden = false;
  document.body.classList.add('overlay-open');
  songRequestForm.hidden = false;
  songRequestSuccess.hidden = true;
}

function goToContactSection() {
  const contactSection = document.getElementById('contactSection');
  if (!contactSection) return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  document.body.classList.remove('keyboard-open');
  updateResponsiveViewport();

  const scrollToContact = () => {
    const top = contactSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, left: 0, behavior: 'auto' });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(scrollToContact);
  });

  window.setTimeout(() => {
    updateResponsiveViewport();
    scrollToContact();
  }, 350);
}

function closeSongRequest() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  songRequestSection.hidden = true;
  document.body.classList.remove('overlay-open');

  songRequestForm.reset();
  songNoteCount.textContent = '0';
  songRequestError.textContent = '';

  songRequestForm.hidden = false;
  songRequestSuccess.hidden = true;

  goToContactSection();
}

songRequestButton?.addEventListener('click', openSongRequest);
closeSongRequestButton?.addEventListener('click', closeSongRequest);
closeSongSuccessButton?.addEventListener('click', closeSongRequest);

songNoteInput?.addEventListener('input', () => {
  songNoteCount.textContent = String(songNoteInput.value.length);
  songRequestError.textContent = '';
});

[songGuestNameInput, songTitleInput, songArtistInput, songNoteInput].forEach((field) => {
  field?.addEventListener('keydown', (event) => {
    event.stopPropagation();
  });
});

songRequestForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = songGuestNameInput.value.trim();
  const songTitle = songTitleInput.value.trim();
  const artist = songArtistInput.value.trim();
  const note = songNoteInput.value.trim();

  if (!name) {
    songRequestError.textContent = 'Lütfen isminizi yazın.';
    songGuestNameInput.focus();
    return;
  }

  if (!songTitle) {
    songRequestError.textContent = 'Lütfen şarkı adını yazın.';
    songTitleInput.focus();
    return;
  }

  if (!artist) {
    songRequestError.textContent = 'Lütfen sanatçı adını yazın.';
    songArtistInput.focus();
    return;
  }

  songRequestError.textContent = '';
  songRequestSubmit.disabled = true;
  songRequestSubmit.classList.add('is-loading');

  try {
    const { error } = await supabase
      .from('song_requests')
      .insert({
        name,
        song_title: songTitle,
        artist,
        note: note || null
      });

    if (error) throw error;

    songRequestForm.reset();
    songNoteCount.textContent = '0';
    songRequestForm.hidden = true;
    songRequestSuccess.hidden = false;
  } catch (error) {
    console.error('Şarkı isteği kaydedilemedi:', {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code
    });

    songRequestError.textContent =
      'Şarkı isteğiniz kaydedilemedi. Lütfen biraz sonra tekrar deneyin.';
  } finally {
    songRequestSubmit.disabled = false;
    songRequestSubmit.classList.remove('is-loading');
  }
});

guestMessageInput?.addEventListener('input', () => {
  messageCount.textContent = String(guestMessageInput.value.length);
  guestbookError.textContent = '';
});

guestbookForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = guestNameInput.value.trim();
  const message = guestMessageInput.value.trim();

  if (!name) {
    guestbookError.textContent = 'Lütfen isminizi yazın.';
    guestNameInput.focus();
    return;
  }

  if (!message) {
    guestbookError.textContent = 'Lütfen anınızı veya güzel dileğinizi yazın.';
    guestMessageInput.focus();
    return;
  }

  guestbookError.textContent = '';
  guestbookSubmit.disabled = true;
  guestbookSubmit.classList.add('is-loading');

  try {
    const { error } = await supabase
      .from('guestbook_messages')
      .insert({
        name,
        message,
        is_approved: true
      });

    if (error) throw error;

    guestbookForm.reset();
    messageCount.textContent = '0';
    guestbookForm.hidden = true;
    guestbookSuccessInline.hidden = false;
  } catch (error) {
    console.error('Anı kaydedilemedi:', {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code
    });

    guestbookError.textContent =
      'Mesajınız kaydedilemedi. Lütfen biraz sonra tekrar deneyin.';
  } finally {
    guestbookSubmit.disabled = false;
    guestbookSubmit.classList.remove('is-loading');
  }
});

const closed = document.querySelector('.closed');
const opened = document.querySelector('.opened');
const paper = document.querySelector('.paper');
const mask = document.querySelector('.mask');
const seal = document.querySelector('#seal');
const tapText = document.querySelector('.tap-text');
const paperFull = document.querySelector('#paperFull');
const invitationStage = document.querySelector('#invitationStage');
const realInvitation = document.querySelector('#realInvitation');
const weddingVideoBackground =
  document.querySelector('#weddingVideoBackground');

const weddingBackgroundVideo =
  document.querySelector('#weddingBackgroundVideo');

  ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'].forEach((eventName) => {
  weddingBackgroundVideo?.addEventListener(
    eventName,
    resumeBackgroundVideo,
    { passive: true }
  );
});

/* Video, zarf sayfasından itibaren aynı kaynakla kesintisiz oynar. */
document.body.classList.add('cinematic-intro');
weddingVideoBackground?.classList.add('is-visible');

startBackgroundVideo();

gsap.set(opened, { opacity: 0 });
gsap.set(mask, { opacity: 0 });

gsap.set(paper, {
  opacity: 0,
  xPercent: -50,
  y: 70,
  scale: 0.9
});

gsap.set(paperFull, {
  autoAlpha: 0,
  display: 'none',
  pointerEvents: 'none'
});

gsap.set(invitationStage, {
  autoAlpha: 0,
  y: 36,
  scale: 0.88,
  transformOrigin: 'center center'
});

gsap.set(realInvitation, {
  filter: 'blur(2px)',
  scale: 0.98,
  transformOrigin: 'center center'
});

const pulse = gsap.to(seal, {
  scale: 1.08,
  duration: 1,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut'
});

let openedState = false;

seal.addEventListener('click', () => {
  startBackgroundVideo();

  if (openedState) return;
  openedState = true;

  document.body.classList.remove('cinematic-intro');
  document.body.classList.add('video-active');

  playWeddingMusic();
  weddingVideoBackground?.classList.add('is-visible');

  startBackgroundVideo();

  pulse.kill();

  gsap.timeline()
    .to(tapText, {
      opacity: 0,
      y: 50,
      duration: 0.25
    })
    .to(seal, {
      scale: 0,
      rotate: 35,
      opacity: 0,
      duration: 0.45,
      ease: 'back.in(1.7)'
    }, 0)
    .to(closed, {
      opacity: 0,
      duration: 0.35
    }, 0.25)
    .to([opened, mask], {
      opacity: 1,
      duration: 0.35
    }, 0.25)
    .to(paper, {
      opacity: 1,
      xPercent: -50,
      y: 18,
      scale: 1.06,
      duration: 1.05,
      ease: 'power3.out'
    }, 0.7)
    .to(paper, {
      y: -8,
      scale: 1.1,
      duration: 0.45,
      ease: 'power2.inOut'
    }, 1.48)
    .to(paper, {
      opacity: 0,
      scale: 1.14,
      duration: 0.3,
      ease: 'power2.in'
    }, 1.72)
    .set(paperFull, {
      display: 'flex',
      pointerEvents: 'auto'
    }, 1.76)
    .call(() => {
      paperFull.classList.add('is-active');
      paperFull.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, null, 1.77)
    .to(paperFull, {
      autoAlpha: 1,
      duration: 0.55,
      ease: 'power2.out'
    }, 1.78)
    .to(invitationStage, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power3.out'
    }, 1.88)
    .to(realInvitation, {
      filter: 'blur(0px)',
      scale: 1,
      duration: 0.7,
      ease: 'power2.out'
    }, 2.02);

});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-arrow');
  if (!btn) return;

  const targetId = btn.dataset.target;
  const target = document.getElementById(targetId);

  if (!target) return;

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});

/* İçerik kartlarını videonun içinden beliriyormuş gibi gösterir. */
const revealSections = document.querySelectorAll(
  '.invitation-stage, .countdown-inner, .locations-content, .reminder-card, .contact-content'
);

revealSections.forEach((section) => section.classList.add('cinematic-reveal'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
      }
    });
  }, { threshold: 0.22 });

  revealSections.forEach((section) => revealObserver.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add('is-in-view'));
}

const nikahDate = new Date('2026-08-22T17:00:00').getTime();
const dugunDate = new Date('2026-08-29T20:00:00').getTime();

function setFinishedMessage(prefix) {
  if (prefix === 'nikah') {
    document.querySelector('#nikahCountdown').innerHTML = `
      <div class="event-finished">
        <h4>Resmi kısım bitti.</h4>
        <p>Şimdi parti zamanı!</p>
        <span>29 Ağustos'ta Manisa'da görüşmek üzere.</span>
      </div>
    `;
    return;
  }

  document.querySelector('#dugunCountdown').innerHTML = `
    <div class="event-finished">
      <h4>Birlikte çok güzeldi!</h4>
      <p>Bu hikayenin bir parçası olduğunuz için çok mutluyuz.</p>
      <span>Sevgiyle,<br>Elçin & Talha</span>
    </div>
  `;
}

function updateCounter(date, prefix) {
  const now = new Date().getTime();
  const distance = date - now;

  if (distance <= 0) {
    setFinishedMessage(prefix);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById(`${prefix}-days`).textContent = String(days).padStart(2, '0');
  document.getElementById(`${prefix}-hours`).textContent = String(hours).padStart(2, '0');
  document.getElementById(`${prefix}-minutes`).textContent = String(minutes).padStart(2, '0');
  document.getElementById(`${prefix}-seconds`).textContent = String(seconds).padStart(2, '0');
}

function updateAllCounters() {
  updateCounter(nikahDate, 'nikah');
  updateCounter(dugunDate, 'dugun');
}

updateAllCounters();
setInterval(updateAllCounters, 1000);

window.addEventListener('wheel', e => {
  if (e.target.closest('.guestbook-page-shell, .song-request-shell')) return;
  e.preventDefault();
}, { passive: false });

window.addEventListener('touchmove', e => {
  if (e.target.closest('.guestbook-page-shell, .song-request-shell')) return;
  e.preventDefault();
}, { passive: false });

window.addEventListener('keydown', e => {
  const target = e.target;

  if (
    target instanceof HTMLElement &&
    target.closest('input, textarea, select, [contenteditable="true"]')
  ) {
    return;
  }

  const keys = [
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End',
    ' '
  ];

  if (keys.includes(e.key)) {
    e.preventDefault();
  }
});
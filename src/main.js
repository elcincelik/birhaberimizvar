import './css/style.css';
import gsap from 'gsap';
import { createIcons, Phone, MessageCircle } from 'lucide';

import closedImg from './assets/envelope/closed.png';
import openImg from './assets/envelope/open.png';
import paperImg from './assets/envelope/paper.png';
import maskImg from './assets/envelope/mask.png';

document.querySelector('#app').innerHTML = `
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
  <div class="paper-content">
    <h1>Elçin <span>&</span> Talha</h1>
    <p class="date">22.09.2026</p>
    <p class="desc">Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.</p>
  </div>

  <div class="section-nav bottom">
    <p class="scroll-text">Kaydırmaya devam et</p>
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
  </div>

  <div class="section-nav bottom">
    <button class="nav-arrow" data-target="nextSection" aria-label="Sonraki sayfaya geç">⌄</button>
  </div>
</section>

<section class="next-section" id="nextSection">
  <div class="section-nav top">
    <button class="nav-arrow" data-target="contactSection" aria-label="İletişim sayfasına dön">⌃</button>
  </div>

  <h2>Devam edecek...</h2>
</section>
`;

/* Lucide ikonlarını HTML oluşturulduktan sonra SVG'ye çevirir */
createIcons({
  icons: {
    Phone,
    MessageCircle
  },
  attrs: {
    'stroke-width': 1.7,
    width: 23,
    height: 23
  }
});

const closed = document.querySelector('.closed');
const opened = document.querySelector('.opened');
const paper = document.querySelector('.paper');
const mask = document.querySelector('.mask');
const seal = document.querySelector('#seal');
const tapText = document.querySelector('.tap-text');
const paperFull = document.querySelector('#paperFull');
const paperContent = document.querySelector('.paper-content');

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
  scale: 0.25,
  display: 'none'
});

gsap.set(paperContent, {
  opacity: 0,
  y: 30
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
  if (openedState) return;
  openedState = true;

  pulse.kill();

  gsap.timeline()
    .to(tapText, {
      opacity: 0,
      y: 70,
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
      y: 70,
      scale: 1,
      duration: 1.3,
      ease: 'power3.out'
    }, 0.75)
    .to(paperFull, {
      autoAlpha: 1,
      scale: 1,
      display: 'flex',
      duration: 0.9,
      ease: 'power3.out',
      onStart: () => {
        document.body.style.overflow = 'auto';
        paperFull.classList.add('is-active');
      },
      onComplete: () => {
        paperFull.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 1.8)
    .to(paperContent, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 2.25);
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
  e.preventDefault();
}, { passive: false });

window.addEventListener('touchmove', e => {
  e.preventDefault();
}, { passive: false });

window.addEventListener('keydown', e => {
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

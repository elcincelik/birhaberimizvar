import { createIcons, ArrowRight, MailCheck, KeyRound, Cloud } from 'lucide';
import doorImg from './assets/themes/sakayik/door-mobile.jpg';
import archImg from './assets/themes/sakayik/arch-mobile.jpg';
import sealImg from './assets/themes/sakayik/seal.png';
import envImg from './assets/home/zarf.jpg';
import envOpenImg from './assets/home/zarf-acik.webp';
import { initI18n, onLangChange, t } from './i18n.js';
import { getUser, isGuest, sendMagicLink, continueWithGoogle, authErrorKey } from './auth.js';

const $ = (id) => document.getElementById(id);
const form = $('authForm');
const fEmail = $('fEmail');
const submit = $('authSubmit');
const submitLabel = submit.querySelector('span');
const msg = $('authMsg');
const stepEmail = $('stepEmail');
const stepSent = $('stepSent');
const sentText = $('sentText');
const resendBtn = $('resendBtn');
const googleBtn = $('googleBtn');

const params = new URLSearchParams(location.search);
const next = safeNext(params.get('next'));
const COOLDOWN = 60;

let email = '';
let busy = false;
let timer = 0;

function safeNext(v) {
  return v && v.startsWith('/') && !v.startsWith('//') ? v : '/panel/';
}

/* ---------- Vitrin: üç sütun, dikey kayan davetiyeler ---------- */
const CARDS = {
  door: `<div class="lc lc-door"><img src="${doorImg}" alt="" /><img class="lc-seal" src="${sealImg}" alt="" /></div>`,
  env: `<div class="lc lc-env"><img src="${envImg}" alt="" /></div>`,
  arch: `<div class="lc lc-arch"><img src="${archImg}" alt="" /><span class="lc-names">Zeynep<i>&amp;</i>Emre</span></div>`,
  open: `<div class="lc lc-open"><img src="${envOpenImg}" alt="" /></div>`,
  date: '<div class="lc lc-date"><small>Save the date</small><b>12</b><span>Eylül 2027</span></div>',
  bday: '<div class="lc lc-bday"><small>Doğum günü</small><b>Defne</b><span>5 yaşında ✦</span></div>',
  henna: '<div class="lc lc-henna"><small>Kına gecesi</small><b>Elif</b><span>✦ ✦ ✦</span></div>'
};

function buildShowcase() {
  const cols = [
    ['door', 'date', 'open', 'henna'],
    ['env', 'arch', 'bday', 'door'],
    ['arch', 'henna', 'door', 'env']
  ];
  cols.forEach((keys, i) => {
    const track = document.getElementById(`col${i + 1}`);
    if (!track) return;
    const html = keys.map((k) => CARDS[k]).join('');
    track.innerHTML = html + html; // kesintisiz döngü için iki kez
  });
}

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function showMsg(text) { msg.textContent = text; msg.className = 'auth-msg is-error'; msg.hidden = false; }
function hideMsg() { msg.hidden = true; }

function setBusy(on) {
  busy = on;
  submit.disabled = on;
  submit.classList.toggle('is-busy', on);
  submitLabel.textContent = on ? t('msg.wait') : t('login.send');
}

function showSent() {
  stepEmail.hidden = true;
  stepSent.hidden = false;
  sentText.innerHTML = t('login.sentText', { email });
  startCooldown();
}

function startCooldown() {
  clearInterval(timer);
  let left = COOLDOWN;
  const tick = () => {
    resendBtn.disabled = left > 0;
    resendBtn.textContent = left > 0 ? t('login.resendIn', { s: left }) : t('login.resend');
    left -= 1;
    if (left < -1) clearInterval(timer);
  };
  tick();
  timer = setInterval(tick, 1000);
}

async function send() {
  await sendMagicLink(email, next);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (busy) return;
  hideMsg();
  email = fEmail.value.trim();
  if (!emailOk(email)) return showMsg(t('msg.badEmail'));

  setBusy(true);
  try {
    await send();
    showSent();
  } catch (err) {
    showMsg(t(authErrorKey(err)));
  } finally {
    setBusy(false);
  }
});

resendBtn.addEventListener('click', async () => {
  resendBtn.disabled = true;
  try {
    await send();
    startCooldown();
  } catch (err) {
    resendBtn.disabled = false;
    sentText.innerHTML = t(authErrorKey(err));
  }
});

$('changeEmail').addEventListener('click', () => {
  clearInterval(timer);
  stepSent.hidden = true;
  stepEmail.hidden = false;
  fEmail.focus();
});

googleBtn.addEventListener('click', async () => {
  hideMsg();
  googleBtn.disabled = true;
  try {
    await continueWithGoogle(next); // sayfa Google'a yönlenir
  } catch (err) {
    showMsg(t(authErrorKey(err)));
    googleBtn.disabled = false;
  }
});

initI18n();
onLangChange(() => {
  if (!stepSent.hidden) sentText.innerHTML = t('login.sentText', { email });
  hideMsg();
});
createIcons({ icons: { ArrowRight, MailCheck, KeyRound, Cloud }, attrs: { 'stroke-width': 1.7 } });
buildShowcase();

// Zaten e-postalı bir hesapla içerideyse doğrudan panele
getUser().then((user) => {
  if (user && !isGuest(user)) location.replace(next);
});

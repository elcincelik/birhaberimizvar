import { createIcons, BadgeCheck, ShieldCheck, Mail, MailOpen, Eye, PenLine } from 'lucide';
import { initI18n, onLangChange, t, getLang, escapeHtml } from './i18n.js';
import {
  supabase, getUser, isGuest, isVerified, pendingEmail, linkEmail, continueWithGoogle,
  signOut, onAuth, authErrorKey
} from './auth.js';

const $ = (id) => document.getElementById(id);
const icons = () => createIcons({
  icons: { BadgeCheck, ShieldCheck, Mail, MailOpen, Eye, PenLine },
  attrs: { 'stroke-width': 1.7 }
});

const params = new URLSearchParams(location.search);
let user = null;
let invitations = [];

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function renderUser() {
  const name = user?.user_metadata?.full_name?.split(' ')[0];
  $('hello').textContent = name ? t('panel.helloName', { name }) : t('panel.hello');
  $('who').innerHTML = isGuest(user)
    ? t('panel.whoGuest')
    : t('panel.whoEmail', { email: user?.email || '' });

  const pending = pendingEmail(user);
  $('claimBox').hidden = !isGuest(user) || !!pending;
  $('pendingBox').hidden = !pending;
  if (pending) $('pendingText').innerHTML = t('panel.pending', { email: pending });

  $('noticeVerified').hidden = !(params.has('dogrulandi') && isVerified(user));
  $('logoutBtn').hidden = isGuest(user);
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return ''; }
}

function renderList() {
  const list = $('invList');
  $('emptyBox').hidden = invitations.length > 0;
  list.innerHTML = invitations.map((inv) => {
    const live = inv.status === 'yayinda';
    const title = escapeHtml(inv.title || t('panel.untitled'));
    const status = t(`panel.status.${inv.status}`) || inv.status;
    const edit = `<a class="btn btn-primary btn-small" href="/editor/?id=${encodeURIComponent(inv.id)}"><i data-lucide="pen-line"></i> ${t('panel.edit')}</a>`;
    const view = inv.slug
      ? `<a class="btn btn-outline btn-small" href="/kapi/?d=${encodeURIComponent(inv.slug)}" target="_blank" rel="noopener"><i data-lucide="eye"></i> ${t(live ? 'panel.view' : 'panel.preview')}</a>`
      : '';
    return `
      <article class="card inv">
        <div class="inv-main">
          <span class="badge-status is-${escapeHtml(inv.status)}">${escapeHtml(status)}</span>
          <h3>${title}</h3>
          <p>${escapeHtml(inv.template || '')} · ${t('panel.updated', { date: fmtDate(inv.updated_at) })}</p>
        </div>
        <div class="inv-actions">${view}${edit}</div>
      </article>`;
  }).join('');
  icons();
}

async function loadInvitations() {
  const { data, error } = await supabase
    .from('davetiyeler')
    .select('id, slug, title, template, status, updated_at')
    .order('updated_at', { ascending: false });
  if (error) {
    // Tablo henüz oluşturulmadıysa (supabase/davetiyeler.sql) boş liste göster
    console.warn('davetiyeler okunamadı:', error.message);
    invitations = [];
  } else {
    invitations = data || [];
  }
  renderList();
}

// Misafir hesaba e-posta bağlama
$('claimForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('claimMsg');
  const btn = $('claimSubmit');
  const email = $('claimEmail').value.trim();
  msg.hidden = true;
  const fail = (text) => { msg.textContent = text; msg.className = 'auth-msg is-error'; msg.hidden = false; };

  if (!emailOk(email)) return fail(t('msg.badEmail'));
  if (!$('claimConsent').checked) return fail(t('msg.consent'));

  btn.disabled = true;
  btn.textContent = t('msg.wait');
  try {
    user = await linkEmail(email);
    renderUser();
  } catch (err) {
    fail(t(authErrorKey(err)));
  } finally {
    btn.disabled = false;
    btn.textContent = t('panel.claimBtn');
  }
});

$('claimGoogle').addEventListener('click', async () => {
  try { await continueWithGoogle('/panel/'); } catch (err) {
    const msg = $('claimMsg');
    msg.textContent = t(authErrorKey(err));
    msg.className = 'auth-msg is-error';
    msg.hidden = false;
  }
});

$('pendingResend').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    await supabase.auth.resend({ type: 'email_change', email: pendingEmail(user) });
    btn.textContent = t('panel.resent');
  } catch {
    btn.disabled = false;
  }
});

$('logoutBtn').addEventListener('click', async () => {
  await signOut();
  location.href = '/';
});

initI18n();
onLangChange(() => { renderUser(); renderList(); });
icons();

(async () => {
  user = await getUser();
  if (!user) {
    // Ne misafir ne gerçek oturum: giriş sayfasına
    location.replace('/giris/?next=/panel/');
    return;
  }
  renderUser();
  document.body.classList.remove('is-loading');
  await loadInvitations();

  onAuth((u) => {
    if (!u) { location.replace('/giris/?next=/panel/'); return; }
    user = u;
    renderUser();
  });
})();

// Şifresiz / misafir hesap akışı
//
// 1) Editör açılınca ensureGuest(): kullanıcı fark etmeden anonim oturum açılır.
// 2) Taslaklar bu kullanıcının id'siyle "davetiyeler" tablosuna kaydedilir.
// 3) Ödeme adımında linkEmail(email): e-posta misafir hesaba bağlanır, doğrulama maili gider.
// 4) Sonradan / başka cihazdan: sendMagicLink(email) ya da continueWithGoogle().
//
// Supabase panelinde açık olmalı: Anonymous sign-ins, Email (magic link),
// Google ile hesap bağlamak için ayrıca Google sağlayıcısı + "Manual linking".

import { supabase } from './supabase.js';

const PANEL = '/panel/';
const url = (path) => `${location.origin}${path}`;

export { supabase };

export const isGuest = (user) => !!user?.is_anonymous;

// E-postası doğrulanmış gerçek hesap mı? (ödeme / yayına alma için bunu şart koşun)
export const isVerified = (user) => !!user && !user.is_anonymous && !!user.email_confirmed_at;

// Doğrulama bekleyen e-posta (misafir hesaba bağlandı ama linke henüz tıklanmadı)
export const pendingEmail = (user) => user?.new_email || (!user?.email_confirmed_at ? user?.email : '') || '';

export async function getUser() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

// Editör açılırken çağırın: oturum yoksa sessizce misafir oturumu açar.
export async function ensureGuest() {
  const existing = await getUser();
  if (existing) return existing;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
}

// Ödeme adımı: e-postayı mevcut (misafir) hesaba bağlar.
// Kullanıcı zaten içeride kalır; doğrulama maili arka planda gider.
export async function linkEmail(email) {
  const { data, error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: url(`${PANEL}?dogrulandi=1`) }
  );
  if (error) throw error;
  return data.user;
}

// Sonradan giriş: şifresiz bağlantı
export async function sendMagicLink(email, next = PANEL) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: url(next), shouldCreateUser: true }
  });
  if (error) throw error;
}

// Google: misafir oturum varsa aynı hesaba bağlar (taslaklar kaybolmaz), yoksa giriş yapar.
export async function continueWithGoogle(next = PANEL) {
  const user = await getUser();
  const opts = { provider: 'google', options: { redirectTo: url(next) } };
  const { error } = isGuest(user)
    ? await supabase.auth.linkIdentity(opts)
    : await supabase.auth.signInWithOAuth(opts);
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export const onAuth = (fn) => supabase.auth.onAuthStateChange((event, session) => fn(session?.user ?? null, event));

// Supabase hata kodlarını i18n anahtarına çevirir
export function authErrorKey(err) {
  const code = err?.code || '';
  const status = err?.status;
  if (code === 'email_exists' || code === 'user_already_exists') return 'msg.emailTaken';
  if (code === 'email_address_invalid' || code === 'validation_failed') return 'msg.badEmail';
  if (code.startsWith('over_') || status === 429) return 'msg.rate';
  if (code === 'anonymous_provider_disabled') return 'msg.guestOff';
  if (code === 'provider_disabled' || code === 'manual_linking_disabled' || /provider is not enabled/i.test(err?.message || '')) return 'msg.googleOff';
  if (code === 'otp_disabled' || code === 'signup_disabled') return 'msg.signupOff';
  return 'msg.generic';
}

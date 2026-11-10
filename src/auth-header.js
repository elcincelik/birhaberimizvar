// Üst menüdeki "Giriş yap" ↔ "Hesabım" durumu.
// Supabase sayfanın ilk açılışını yavaşlatmasın diye sonradan yüklenir.
export async function initAuthHeader() {
  const link = document.getElementById('authLink');
  const account = document.getElementById('account');
  if (!link || !account) return;

  const btn = document.getElementById('accountBtn');
  const menu = document.getElementById('accountMenu');
  const emailEl = document.getElementById('accountEmail');
  const initialEl = document.getElementById('accountInitial');

  let supabase;
  try {
    ({ supabase } = await import('./supabase.js'));
  } catch {
    return; // Supabase yoksa "Giriş yap" görünmeye devam eder
  }

  const render = (session) => {
    // Misafir (anonim) oturum "giriş yapılmış" sayılmaz
    const user = session?.user && !session.user.is_anonymous ? session.user : null;
    link.hidden = !!user;
    account.hidden = !user;
    if (!user) { closeMenu(); return; }
    const name = user.user_metadata?.full_name || user.email || '';
    emailEl.textContent = user.email || '';
    initialEl.textContent = (name.trim()[0] || '?').toLocaleUpperCase('tr');
  };

  const closeMenu = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => { if (!account.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    render(null);
  });

  const { data } = await supabase.auth.getSession();
  render(data.session);
  supabase.auth.onAuthStateChange((_event, session) => render(session));
}

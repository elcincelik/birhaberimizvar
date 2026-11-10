import {
  createIcons, Check, MailCheck, Hourglass, MapPin, BookOpen, Music2, Headphones, Phone,
  Smartphone, ArrowUpRight, Flower2
} from 'lucide';
import { initI18n } from './i18n.js';
import { initAuthHeader } from './auth-header.js';

initI18n();
initAuthHeader();

createIcons({
  icons: { Check, MailCheck, Hourglass, MapPin, BookOpen, Music2, Headphones, Phone, Smartphone, ArrowUpRight, Flower2 },
  attrs: { 'stroke-width': 1.6 }
});

// Kaydırınca beliren öğeler
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// Üst menü çizgisi
const topbar = document.querySelector('.topbar');
const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// SSS: aynı anda tek soru açık
const faqs = document.querySelectorAll('.faq-list details');
faqs.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
}));

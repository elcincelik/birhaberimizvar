import gsap from 'gsap';

const pages = [
  'paperFull',
  'countdown',
  'locationsSection',
  'reminderSection',
  'contactSection'
].map((id) => document.getElementById(id));

let current = 0;
let enabled = false;
let busy = false;

/* Tek ok çifti (tüm sayfalarda aynı yerde) */
const nav = document.createElement('div');
nav.className = 'page-nav';
nav.innerHTML = `
  <button type="button" class="page-nav-btn up" aria-label="Önceki sayfa"></button>
  <button type="button" class="page-nav-btn down" aria-label="Sonraki sayfa"></button>
`;
document.body.appendChild(nav);

const upButton = nav.querySelector('.up');
const downButton = nav.querySelector('.down');

function updateNav() {
  nav.classList.toggle('is-on', enabled);
  upButton.classList.toggle('is-hidden', current === 0);
  downButton.classList.toggle('is-hidden', current === pages.length - 1);
}

function canNavigate() {
  return enabled && !document.body.classList.contains('overlay-open');
}

/* Sayfayı animasyonsuz, anında hizala */
function jumpTo(element) {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top);
  requestAnimationFrame(() => {
    html.style.scrollBehavior = previous;
  });
}

/* Geçiş: eski sayfa silinir, yenisi belirir */
function goTo(next) {
  if (busy || next < 0 || next >= pages.length || next === current) return;

  busy = true;
  const direction = next > current ? 1 : -1;
  const from = pages[current];
  const to = pages[next];

  current = next;
  updateNav();

  gsap.to(from, {
    opacity: 0,
    y: -22 * direction,
    duration: 0.35,
    ease: 'power2.in',
    onComplete: () => {
      jumpTo(to);
      gsap.set(from, { opacity: 1, y: 0 });

      gsap.fromTo(
        to,
        { opacity: 0, y: 22 * direction },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
          onComplete: () => {
            busy = false;
          }
        }
      );
    }
  });
}

/* Oklar */
upButton.addEventListener('click', () => canNavigate() && goTo(current - 1));
downButton.addEventListener('click', () => canNavigate() && goTo(current + 1));

/* Fare tekeri ve trackpad */
let wheelAccumulator = 0;
let wheelLocked = false;
let wheelTimer = null;

window.addEventListener(
  'wheel',
  (event) => {
    if (!canNavigate()) return;

    // Hareket durunca (180 ms sessizlik) sistem yeni kaydırmaya hazırlanır
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => {
      wheelAccumulator = 0;
      wheelLocked = false;
    }, 180);

    if (wheelLocked) return;
    // Küçük hareketleri topla, yeterli olunca bir sayfa ilerle
    wheelAccumulator += event.deltaY;

    if (Math.abs(wheelAccumulator) >= 40) {
      goTo(current + (wheelAccumulator > 0 ? 1 : -1));
      wheelAccumulator = 0;
      wheelLocked = true;
    }
  },
  { passive: true }
);
/* Telefonda parmakla yukarı / aşağı kaydırma */
let touchStartY = null;

window.addEventListener(
  'touchstart',
  (event) => {
    touchStartY = event.touches[0].clientY;
  },
  { passive: true }
);

window.addEventListener(
  'touchend',
  (event) => {
    if (touchStartY === null) return;

    const distance = touchStartY - event.changedTouches[0].clientY;
    touchStartY = null;

    if (!canNavigate() || Math.abs(distance) < 50) return;
    goTo(current + (distance > 0 ? 1 : -1));
  },
  { passive: true }
);

/* Klavye */
window.addEventListener('keydown', (event) => {

    if (!canNavigate()) return;
  if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select')) return;

  if (event.key === 'ArrowDown' || event.key === 'PageDown') goTo(current + 1);
  if (event.key === 'ArrowUp' || event.key === 'PageUp') goTo(current - 1);
});

/* Ekran boyutu değişirse sayfayı yeniden hizala */
window.addEventListener('resize', () => {
  if (!canNavigate() || busy) return;
  jumpTo(pages[current]);
});

/* Zarf açılıp davetiye sayfası görününce sistemi başlat */
new MutationObserver(() => {
  if (pages[0].classList.contains('is-active') && !enabled) {
    window.setTimeout(() => {
      enabled = true;
      updateNav();
    }, 1500);
  }
}).observe(pages[0], { attributes: true, attributeFilter: ['class'] });

updateNav();
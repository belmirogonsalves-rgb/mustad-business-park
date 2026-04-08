/* =============================================================
   Mustad Business Park — main.js
   Handles: modal, filter chips, toast, mobile nav, floor plan
   ============================================================= */

'use strict';

/* ── Hero entrance ──────────────────────────────────────────── */
document.body.classList.add('hero-loaded');

/* ── Remove page-enter after animation so transform doesn't break fixed positioning */
document.body.addEventListener('animationend', function () {
  document.body.classList.remove('page-enter');
}, { once: true });

/* ── Nav glass on scroll ────────────────────────────────────── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Hero parallax ──────────────────────────────────────────── */
(function () {
  const bg = document.querySelector('.hero__bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      bg.style.transform = `translateY(${y * 0.28}px)`;
    }
  }, { passive: true });
})();

/* ── Scroll reveal (IntersectionObserver) ───────────────────── */
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('is-visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();

/* ── Selectors ───────────────────────────────────────────── */

const modalOverlay   = document.getElementById('modalOverlay');
const modalClose     = document.getElementById('modalClose');
const modalForm      = document.getElementById('modalForm');
const modalSubtitle  = document.getElementById('modalSubtitle');

const detailOverlay  = document.getElementById('detailOverlay');
const detailClose    = document.getElementById('detailClose');
const detailImage    = document.getElementById('detailImage');
const detailBadge    = document.getElementById('detailBadge');
const detailBuilding = document.getElementById('detailBuilding');
const detailTitle    = document.getElementById('detailTitle');
const detailSize     = document.getElementById('detailSize');
const detailType     = document.getElementById('detailType');
const detailDesc     = document.getElementById('detailDesc');
const detailFeatures = document.getElementById('detailFeatures');
const detailBookBtn  = document.getElementById('detailBookBtn');
const detailPrev     = document.getElementById('detailPrev');
const detailNext     = document.getElementById('detailNext');
const detailDots     = document.getElementById('detailDots');
const detailExpand   = document.getElementById('detailExpand');
const detailImageWrap = detailImage ? detailImage.parentElement : null;

const fsViewer  = document.getElementById('fullscreenViewer');
const fsImg     = document.getElementById('fullscreenImg');
const fsClose   = document.getElementById('fullscreenClose');
const fsPrev    = document.getElementById('fullscreenPrev');
const fsNext    = document.getElementById('fullscreenNext');

let galleryImages = [];
let galleryIndex = 0;

const floorplanOverlay = document.getElementById('floorplanOverlay');
const floorplanClose   = document.getElementById('floorplanClose');
const floorplanForm    = document.getElementById('floorplanForm');

const toast         = document.getElementById('toast');

const contactForm   = document.getElementById('contactForm');

const buildingChips = document.querySelectorAll('.chip--building');
const chips         = document.querySelectorAll('.chip');
const unitCards     = document.querySelectorAll('#unitsGrid .unit-card');

const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');


/* ── Modal helpers ───────────────────────────────────────── */

function openModal(unitName) {
  if (!modalOverlay) return;
  if (modalSubtitle) modalSubtitle.textContent = unitName ? `Enquiry for: ${unitName}` : '';
  modalOverlay.hidden = false;

  if (modalForm) {
    const firstInput = modalForm.querySelector('input, select');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
  }
}

function closeModal() {
  if (modalOverlay) modalOverlay.hidden = true;
}

function openFloorplan() {
  if (!floorplanOverlay) return;
  floorplanOverlay.hidden = false;
  if (floorplanForm) {
    const emailInput = floorplanForm.querySelector('input[type="email"]');
    if (emailInput) setTimeout(() => emailInput.focus(), 50);
  }
}

function closeFloorplan() {
  if (floorplanOverlay) floorplanOverlay.hidden = true;
}


/* ── Toast ───────────────────────────────────────────────── */

let toastTimer;

function showToast() {
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 4000);
}


/* ── Detail modal helpers ────────────────────────────────── */

const buildingLabels = {
  mustad: 'Mustad Business Park',
  brighthouse: 'Bright House',
  foundry: 'The Foundry'
};

function openDetail(card) {
  if (!detailOverlay) return;
  const img = card.querySelector('.unit-card__image img');
  const name = card.querySelector('.unit-card__name');
  const size = card.querySelector('.unit-card__size');
  const type = card.querySelector('.unit-card__type');
  const badge = card.querySelector('.unit-card__badge');

  if (detailImage) { detailImage.src = img ? img.src : ''; detailImage.alt = img ? img.alt : ''; }
  if (detailBadge) detailBadge.textContent = badge ? badge.textContent : '';
  if (detailBuilding) detailBuilding.textContent = buildingLabels[card.dataset.building] || '';
  if (detailTitle) detailTitle.textContent = name ? name.textContent : '';
  if (detailSize) detailSize.textContent = size ? size.textContent : '';
  if (detailType) detailType.textContent = type ? type.textContent : '';
  if (detailDesc) detailDesc.textContent = card.dataset.desc || '';

  if (detailFeatures) {
    detailFeatures.innerHTML = '';
    const features = (card.dataset.features || '').split('|').filter(Boolean);
    features.forEach(f => {
      const span = document.createElement('span');
      span.className = 'detail-modal__feature';
      span.textContent = f.trim();
      detailFeatures.appendChild(span);
    });
  }

  if (detailBookBtn) detailBookBtn.dataset.unit = name ? name.textContent : '';

  // Gallery setup
  const imagesData = card.dataset.images || '';
  galleryImages = imagesData ? imagesData.split('|').filter(Boolean) : [];

  if (galleryImages.length > 1) {
    galleryIndex = 0;
    if (detailImageWrap) detailImageWrap.classList.add('detail-modal__image-wrap--gallery');
    if (detailImage) detailImage.src = galleryImages[0];
    renderDots();
  } else {
    if (detailImageWrap) detailImageWrap.classList.remove('detail-modal__image-wrap--gallery');
  }

  detailOverlay.hidden = false;
}

function closeDetail() {
  if (detailOverlay) detailOverlay.hidden = true;
}

function showGalleryImage(index) {
  if (!galleryImages.length) return;
  galleryIndex = (index + galleryImages.length) % galleryImages.length;
  if (detailImage) {
    detailImage.style.opacity = '0';
    setTimeout(function () {
      detailImage.src = galleryImages[galleryIndex];
      detailImage.style.opacity = '1';
    }, 200);
  }
  renderDots();
}

function renderDots() {
  if (!detailDots) return;
  detailDots.innerHTML = '';
  galleryImages.forEach(function (_, i) {
    const dot = document.createElement('span');
    dot.className = 'detail-modal__dot' + (i === galleryIndex ? ' detail-modal__dot--active' : '');
    dot.addEventListener('click', function () { showGalleryImage(i); });
    detailDots.appendChild(dot);
  });
}

if (detailPrev) detailPrev.addEventListener('click', function () { showGalleryImage(galleryIndex - 1); });
if (detailNext) detailNext.addEventListener('click', function () { showGalleryImage(galleryIndex + 1); });


/* ── Fullscreen image viewer ────────────────────────────── */

function openFullscreen() {
  if (!fsViewer || !fsImg || !detailImage) return;
  fsImg.src = detailImage.src;
  fsImg.alt = detailImage.alt;
  if (fsPrev) fsPrev.style.display = galleryImages.length > 1 ? 'flex' : 'none';
  if (fsNext) fsNext.style.display = galleryImages.length > 1 ? 'flex' : 'none';
  fsViewer.classList.add('is-open');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      fsViewer.classList.add('is-visible');
    });
  });
}

function closeFullscreen() {
  if (!fsViewer) return;
  fsViewer.classList.remove('is-visible');
  fsViewer.addEventListener('transitionend', function handler() {
    fsViewer.classList.remove('is-open');
    fsViewer.removeEventListener('transitionend', handler);
  });
}

function isFullscreenOpen() {
  return fsViewer && fsViewer.classList.contains('is-open');
}

if (detailExpand) detailExpand.addEventListener('click', openFullscreen);
if (fsClose) fsClose.addEventListener('click', closeFullscreen);

if (fsViewer) fsViewer.addEventListener('click', function (e) {
  if (e.target === fsViewer) closeFullscreen();
});

if (fsPrev) fsPrev.addEventListener('click', function () {
  if (!fsImg) return;
  fsImg.style.opacity = '0';
  setTimeout(function () {
    showGalleryImage(galleryIndex - 1);
    fsImg.src = galleryImages[galleryIndex];
    fsImg.style.opacity = '1';
  }, 200);
});

if (fsNext) fsNext.addEventListener('click', function () {
  if (!fsImg) return;
  fsImg.style.opacity = '0';
  setTimeout(function () {
    showGalleryImage(galleryIndex + 1);
    fsImg.src = galleryImages[galleryIndex];
    fsImg.style.opacity = '1';
  }, 200);
});


/* ── Event: clicking unit card or "View details" → open detail modal ── */

document.addEventListener('click', function (e) {
  const card = e.target.closest('.unit-card');
  if (!card) return;
  // Don't open if clicking a link that navigates away
  if (e.target.closest('a[href]')) return;
  openDetail(card);
});


/* ── Event: "Book a viewing" buttons → open booking modal ── */

document.addEventListener('click', function (e) {
  const trigger = e.target.closest('.js-open-modal');
  if (!trigger) return;
  const unitName = trigger.dataset.unit || '';
  closeDetail();
  openModal(unitName);
});


/* ── Event: close modals ─────────────────────────────────── */

if (modalClose) modalClose.addEventListener('click', closeModal);
if (detailClose) detailClose.addEventListener('click', closeDetail);

// Close any open modal when clicking outside it
document.addEventListener('click', function (e) {
  // Don't close if clicking a trigger button or a unit card
  if (e.target.closest('.unit-card') || e.target.closest('.js-open-detail') || e.target.closest('.js-open-modal') || e.target.closest('.js-open-floorplan')) return;

  // Check detail modal
  if (detailOverlay && !detailOverlay.hidden) {
    const detailModal = detailOverlay.querySelector('.modal');
    if (detailModal && !detailModal.contains(e.target)) closeDetail();
  }

  // Check booking modal
  if (modalOverlay && !modalOverlay.hidden) {
    const bookingModal = modalOverlay.querySelector('.modal');
    if (bookingModal && !bookingModal.contains(e.target)) closeModal();
  }

  // Check floorplan modal
  if (floorplanOverlay && !floorplanOverlay.hidden) {
    const fpModal = floorplanOverlay.querySelector('.modal');
    if (fpModal && !fpModal.contains(e.target)) closeFloorplan();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (isFullscreenOpen()) { closeFullscreen(); return; }
    if (detailOverlay && !detailOverlay.hidden) closeDetail();
    if (modalOverlay && !modalOverlay.hidden) closeModal();
    if (floorplanOverlay && !floorplanOverlay.hidden) closeFloorplan();
  }
});


/* ── Event: modal form submit ────────────────────────────── */

if (modalForm) modalForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!modalForm.checkValidity()) {
    modalForm.reportValidity();
    return;
  }
  closeModal();
  showToast();
  modalForm.reset();
});


/* ── Event: "Download floor plan" ghost CTA ──────────────── */

document.querySelectorAll('.js-open-floorplan').forEach(btn => {
  btn.addEventListener('click', openFloorplan);
});

if (floorplanClose) floorplanClose.addEventListener('click', closeFloorplan);

if (floorplanOverlay) floorplanOverlay.addEventListener('click', function (e) {
  if (e.target === floorplanOverlay) closeFloorplan();
});

if (floorplanForm) floorplanForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!floorplanForm.checkValidity()) {
    floorplanForm.reportValidity();
    return;
  }
  closeFloorplan();
  showToast();
  floorplanForm.reset();
});


/* ── Event: contact form submit ──────────────────────────── */

if (contactForm) contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  showToast();
  contactForm.reset();
});


/* ── Filter chips ────────────────────────────────────────── */

buildingChips.forEach(chip => {
  chip.addEventListener('click', function () {
    buildingChips.forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');
    const filter = chip.dataset.building;
    unitCards.forEach(card => {
      const match = filter === 'all' || card.dataset.building === filter;
      card.classList.toggle('unit-card--hidden', !match);
    });
  });
});


/* ── Mobile hamburger ────────────────────────────────────── */

if (hamburger) hamburger.addEventListener('click', function () {
  const isOpen = mobileMenu.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

if (mobileMenu) mobileMenu.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});


/* ── Smooth scroll for nav links ─────────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById('nav').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── Occupancy bar load animation ───────────────────────── */

(function () {
  const bar        = document.querySelector('.hero__occ-bar');
  const fill       = document.querySelector('.hero__occ-fill');
  const valueEl    = document.querySelector('.hero__occ-value');
  if (!bar || !fill || !valueEl) return;

  // Read the actual percentage from the aria attribute
  const target = parseInt(bar.getAttribute('aria-valuenow'), 10) || 87;

  // Animate the numeric counter
  function animateCounter(el, end, duration) {
    const start     = performance.now();
    const startVal  = 0;
    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(startVal + (end - startVal) * eased) + '%';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Delay slightly so the CSS transition registers from width:0
  setTimeout(() => {
    fill.style.width = target + '%';
    animateCounter(valueEl, target, 1600);
  }, 300);
})();


/* ── Why Mustad carousel ─────────────────────────────────── */

(function () {
  const track    = document.getElementById('whyTrack');
  const prevBtn  = document.getElementById('whyPrev');
  const nextBtn  = document.getElementById('whyNext');
  const dotsWrap = document.getElementById('whyDots');

  if (!track) return;

  const cards       = Array.from(track.children);
  const GAP         = 20;
  const VISIBLE     = () => window.innerWidth <= 768 ? 1 : 2;
  let   current     = 0;

  /* Size cards and build dots */
  function setup() {
    const wrapWidth = track.parentElement.offsetWidth;
    const vis       = VISIBLE();
    const cardWidth = (wrapWidth - GAP * (vis - 1)) / vis;

    cards.forEach(c => { c.style.width = cardWidth + 'px'; });

    // Rebuild dots
    dotsWrap.innerHTML = '';
    const total = cards.length - vis + 1;
    for (let i = 0; i < Math.max(total, 1); i++) {
      const btn = document.createElement('button');
      btn.className = 'why__dot' + (i === current ? ' why__dot--active' : '');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.setAttribute('role', 'tab');
      btn.dataset.index = i;
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }

    goTo(current, false); // reposition without animation
  }

  function maxIndex() {
    return Math.max(0, cards.length - VISIBLE());
  }

  function goTo(index, animate = true) {
    current = Math.max(0, Math.min(index, maxIndex()));

    const wrapWidth = track.parentElement.offsetWidth;
    const vis       = VISIBLE();
    const cardWidth = (wrapWidth - GAP * (vis - 1)) / vis;
    const offset    = current * (cardWidth + GAP);

    track.style.transition = animate
      ? 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none';
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dotsWrap.querySelectorAll('.why__dot').forEach((dot, i) => {
      dot.classList.toggle('why__dot--active', i === current);
    });

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Initialise and re-layout on resize
  setup();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 120);
  });
})();


/* ── Smooth page transitions for internal links ─────────── */

document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;

  e.preventDefault();
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(-8px)';
  document.body.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

  setTimeout(function () {
    window.location.href = href;
  }, 250);
});

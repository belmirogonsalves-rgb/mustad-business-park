/* =============================================================
   Property detail pages — property.js
   Handles: nav scroll, mobile menu, smooth transitions
   ============================================================= */

'use strict';

/* ── Clear page-enter animation (transform breaks position:fixed) */
(function () {
  document.body.addEventListener('animationend', function () {
    document.body.classList.remove('page-enter');
  }, { once: true });
})();

/* ── Nav glass on scroll ────────────────────────────────────── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile hamburger ────────────────────────────────────────── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileMenu.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
})();

/* ── Campus map modal ───────────────────────────────────────── */
(function () {
  var modal = document.getElementById('mapModal');
  var openBtn = document.getElementById('openMap');
  var closeBtn = document.getElementById('mapCloseBtn');
  var backdrop = document.getElementById('mapClose');
  if (!modal || !openBtn) return;

  function open() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    /* body scroll stays enabled */
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    /* body scroll not locked */
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();

/* ── Detail modal for unit cards ─────────────────────────────── */
(function () {
  var overlay = document.getElementById('detailOverlay');
  var closeBtn = document.getElementById('detailClose');
  if (!overlay) return;

  var buildingLabels = {
    mustad: 'Mustad Business Park',
    brighthouse: 'Bright House',
    foundry: 'The Foundry'
  };

  function openDetail(card) {
    var img = card.querySelector('.unit-card__image img');
    var name = card.querySelector('.unit-card__name');
    var size = card.querySelector('.unit-card__size');
    var type = card.querySelector('.unit-card__type');
    var badge = card.querySelector('.unit-card__badge');

    document.getElementById('detailImage').src = img ? img.src : '';
    document.getElementById('detailImage').alt = img ? img.alt : '';
    document.getElementById('detailBadge').textContent = badge ? badge.textContent : '';
    document.getElementById('detailBuilding').textContent = buildingLabels[card.dataset.building] || '';
    document.getElementById('detailTitle').textContent = name ? name.textContent : '';
    document.getElementById('detailSize').textContent = size ? size.textContent : '';
    document.getElementById('detailType').textContent = type ? type.textContent : '';
    document.getElementById('detailDesc').textContent = card.dataset.desc || '';

    var featuresEl = document.getElementById('detailFeatures');
    featuresEl.innerHTML = '';
    var features = (card.dataset.features || '').split('|').filter(Boolean);
    features.forEach(function (f) {
      var span = document.createElement('span');
      span.className = 'detail-modal__feature';
      span.textContent = f.trim();
      featuresEl.appendChild(span);
    });

    overlay.hidden = false;
    /* body scroll stays enabled */
  }

  function closeDetail() {
    overlay.hidden = true;
    /* body scroll not locked */
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.js-open-detail');
    if (!trigger) return;
    var card = trigger.closest('.unit-card');
    if (card) openDetail(card);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDetail);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeDetail();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) closeDetail();
  });
})();

/* ── Page transition on internal links ───────────────────────── */
(function () {
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Skip external links, anchors, and mailto/tel
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;

    e.preventDefault();
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(-8px)';
    document.body.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

    setTimeout(() => {
      window.location.href = href;
    }, 250);
  });
})();

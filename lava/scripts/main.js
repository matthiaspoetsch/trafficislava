'use strict';

/* ============================================================
   TRAFFIC IS LAVA — main.js
   Nav scroll state, mobile menu, hero parallax + entrance,
   section fade-ins, ride modal, active nav, footer year.
   ============================================================ */


// ── Reduced-motion preference ────────────────────────────────
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ── Footer year ─────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ── Sticky nav ───────────────────────────────────────────────
const nav = document.getElementById('nav');

function onScroll() {
  nav.classList.toggle('is-scrolled', window.scrollY > 32);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load


// ── Mobile menu ──────────────────────────────────────────────
const toggle   = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

function openMenu() {
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Close menu');
  navLinks.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  navLinks.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Close when a nav link is tapped
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}


// ── Fade-in on scroll ────────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length && 'IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -32px 0px',
  });

  fadeEls.forEach(el => fadeObserver.observe(el));
} else {
  // Fallback for browsers without IntersectionObserver
  fadeEls.forEach(el => el.classList.add('is-visible'));
}


// ── Ride detail modal ────────────────────────────────────────
const modal       = document.getElementById('ride-modal');
const modalClose  = document.getElementById('modal-close');
const modalBack   = document.getElementById('modal-backdrop');
const modalMap    = document.getElementById('modal-map');
const modalType   = document.getElementById('modal-type');
const modalDate   = document.getElementById('modal-date');
const modalTitle  = document.getElementById('modal-title');
const modalDesc   = document.getElementById('modal-desc');
const modalTime   = document.getElementById('modal-time');
const modalMeet   = document.getElementById('modal-meet');
const modalDist   = document.getElementById('modal-distance');
const modalKomoot = document.getElementById('modal-komoot');
const modalStrava = document.getElementById('modal-strava');

function openModal(ride) {
  const d = ride.dataset;

  // Populate text fields
  modalType.textContent     = d.type;
  modalDate.textContent     = d.date;
  modalTitle.textContent    = d.title;
  modalDesc.textContent     = d.desc;
  modalTime.textContent     = d.time;
  modalMeet.textContent     = d.meet;
  modalDist.textContent     = d.distance;

  // Komoot embed — iframe if URL present, placeholder otherwise
  if (d.komoot) {
    modalMap.innerHTML = `<iframe src="${d.komoot}" title="Komoot route map" loading="lazy" allowfullscreen></iframe>`;
  } else {
    modalMap.innerHTML = `
      <div class="ride-modal__map-placeholder">
        <span>Route map</span>
        <span>Add a Komoot embed URL to data-komoot on this ride</span>
      </div>`;
  }

  // Komoot link
  if (d.komoot) {
    // Convert embed URL to public URL (strip /embed suffix)
    const komootPublic = d.komoot.replace(/\/embed(\?.*)?$/, '');
    modalKomoot.href = komootPublic;
    modalKomoot.classList.remove('ride-modal__link--disabled');
  } else {
    modalKomoot.href = '#';
    modalKomoot.classList.add('ride-modal__link--disabled');
  }

  // Strava link
  if (d.strava) {
    modalStrava.href = d.strava;
    modalStrava.classList.remove('ride-modal__link--disabled');
  } else {
    modalStrava.href = '#';
    modalStrava.classList.add('ride-modal__link--disabled');
  }

  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  // Focus the close button for keyboard users
  requestAnimationFrame(() => modalClose.focus());
}

function closeModal() {
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  // Clear iframe on close to stop any audio/tile loading
  modalMap.innerHTML = '';
}

// Ride modal wiring is handled by loadRides() below.

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalBack)  modalBack.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
});


// ── Hero parallax ────────────────────────────────────────────
// Background drifts at 38% of scroll rate — appears deeper than content.
// Disabled for reduced-motion and touch/pointer:coarse devices.
const heroBgImg   = document.querySelector('.hero__bg img');
const heroSection = document.getElementById('home');
const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (heroBgImg && heroSection && !reducedMotion && !isCoarsePointer) {
  let parallaxTicking = false;

  function applyParallax() {
    const scrollY = window.scrollY;
    // Only run while the hero is at least partially visible
    if (scrollY < heroSection.offsetHeight) {
      heroBgImg.style.transform = `translateY(${scrollY * 0.38}px)`;
    }
    parallaxTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      requestAnimationFrame(applyParallax);
      parallaxTicking = true;
    }
  }, { passive: true });
}


// ── Active nav link tracking ─────────────────────────────────
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav__link[href^="#"]');

if (sections.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        const matches = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', matches);
      });
    });
  }, {
    threshold: 0.35,
  });

  sections.forEach(s => sectionObserver.observe(s));
}


// ── Rides — fetch + render ───────────────────────────────────
const upcomingContainer = document.getElementById('upcoming-rides-container');
const pastContainer     = document.getElementById('past-rides-container');
const pastToggle        = document.getElementById('past-rides-toggle');
const pastCountEl       = document.getElementById('past-rides-count');

function formatDisplayDate(isoDate) {
  // "2026-04-06" → "Mon, 06 Apr 2026"
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });
}

function applyRideData(el, ride) {
  el.dataset.type     = ride.type;
  el.dataset.date     = formatDisplayDate(ride.date);
  el.dataset.title    = ride.title;
  el.dataset.desc     = ride.description;
  el.dataset.time     = ride.time;
  el.dataset.meet     = ride.meet;
  el.dataset.distance = ride.distance;
  el.dataset.komoot   = ride.komoot  || '';
  el.dataset.strava   = ride.strava  || '';
}

function createFeatured(ride) {
  const displayDate = formatDisplayDate(ride.date);
  const a = document.createElement('article');
  a.className = 'ride-featured ride-item is-visible';
  a.setAttribute('role', 'button');
  a.setAttribute('tabindex', '0');
  a.setAttribute('aria-label', `${ride.title} — ${displayDate}. Click for details.`);
  applyRideData(a, ride);
  a.innerHTML = `
    <div class="ride-featured__header">
      <span class="ride-item__type label mono">${ride.type}</span>
      <time class="ride-item__date mono" datetime="${ride.date}">${displayDate}</time>
    </div>
    <h3 class="ride-featured__title">${ride.title}</h3>
    <p class="ride-featured__desc">${ride.description}</p>
    <dl class="spec-list ride-featured__specs">
      <div class="spec-row"><dt>TIME</dt><dd>${ride.time}</dd></div>
      <div class="spec-row"><dt>MEET</dt><dd>${ride.meet}</dd></div>
      <div class="spec-row"><dt>DISTANCE</dt><dd>${ride.distance}</dd></div>
    </dl>
    <span class="ride-featured__cta mono">View details →</span>
  `;
  return a;
}

function createRideItem(ride) {
  const displayDate = formatDisplayDate(ride.date);
  const a = document.createElement('article');
  a.className = 'ride-item is-visible';
  a.setAttribute('role', 'button');
  a.setAttribute('tabindex', '0');
  a.setAttribute('aria-label', `${ride.title} — ${displayDate}. Click for details.`);
  applyRideData(a, ride);
  a.innerHTML = `
    <div class="ride-item__meta">
      <span class="ride-item__type label mono">${ride.type}</span>
      <time class="ride-item__date mono" datetime="${ride.date}">${displayDate}</time>
    </div>
    <div class="ride-item__body">
      <h3 class="ride-item__title">${ride.title}</h3>
      <p class="ride-item__desc">${ride.description}</p>
    </div>
    <dl class="spec-list ride-item__specs">
      <div class="spec-row"><dt>TIME</dt><dd>${ride.time}</dd></div>
      <div class="spec-row"><dt>MEET</dt><dd>${ride.meet}</dd></div>
      <div class="spec-row"><dt>DISTANCE</dt><dd>${ride.distance}</dd></div>
    </dl>
  `;
  return a;
}

function createPastItem(ride) {
  const displayDate = formatDisplayDate(ride.date);
  const a = document.createElement('article');
  a.className = 'ride-past ride-item is-visible';
  a.setAttribute('role', 'button');
  a.setAttribute('tabindex', '0');
  a.setAttribute('aria-label', `${ride.title} — ${displayDate}. Click for details.`);
  applyRideData(a, ride);
  a.innerHTML = `
    <span class="ride-item__type label mono">${ride.type}</span>
    <span class="ride-past__title">${ride.title}</span>
    <time class="ride-past__date mono" datetime="${ride.date}">${displayDate}</time>
    <span class="ride-past__arrow" aria-hidden="true">→</span>
  `;
  return a;
}

function wireRideModals() {
  document.querySelectorAll('.ride-item').forEach(item => {
    item.addEventListener('click', () => openModal(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item);
      }
    });
  });
}

async function loadRides() {
  if (!upcomingContainer) return;

  upcomingContainer.innerHTML = '<div class="rides__loading">Loading…</div>';

  try {
    const res = await fetch('assets/rides.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rides = data.rides || [];

    const upcoming = rides
      .filter(r => r.status === 'upcoming')
      .sort((a, b) => a.date.localeCompare(b.date));

    const past = rides
      .filter(r => r.status === 'past')
      .sort((a, b) => b.date.localeCompare(a.date)); // newest first

    // Render upcoming
    upcomingContainer.innerHTML = '';
    if (upcoming.length === 0) {
      upcomingContainer.innerHTML = '<div class="rides__empty">No upcoming rides scheduled yet. Check back soon.</div>';
    } else {
      upcomingContainer.appendChild(createFeatured(upcoming[0]));
      if (upcoming.length > 1) {
        const list = document.createElement('div');
        list.className = 'rides__list rides__list--secondary';
        upcoming.slice(1).forEach(r => list.appendChild(createRideItem(r)));
        upcomingContainer.appendChild(list);
      }
    }

    // Render past
    if (past.length > 0 && pastContainer && pastToggle) {
      if (pastCountEl) pastCountEl.textContent = `(${past.length})`;
      past.forEach(r => pastContainer.appendChild(createPastItem(r)));

      pastToggle.addEventListener('click', () => {
        const isOpen = pastToggle.getAttribute('aria-expanded') === 'true';
        pastToggle.setAttribute('aria-expanded', String(!isOpen));
        isOpen
          ? pastContainer.setAttribute('hidden', '')
          : pastContainer.removeAttribute('hidden');
      });
    } else if (pastToggle && pastToggle.parentElement) {
      pastToggle.parentElement.style.display = 'none';
    }

    wireRideModals();

  } catch (err) {
    upcomingContainer.innerHTML =
      '<div class="rides__empty">Could not load rides. Open the page via a local server (<code>npx serve .</code>) or check the console.</div>';
    console.error('Failed to load rides.json:', err);
  }
}

loadRides();

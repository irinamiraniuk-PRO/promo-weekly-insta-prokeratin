/**
 * PROKERATIN — WEEKLY PROMO LANDING PAGE
 * script.js
 *
 * Features:
 *  1. Countdown timer — reads data-deadline from .countdown-wrap
 *  2. Scroll-reveal animations — [data-animate] elements fade in on enter
 *
 * To change the promo end date: edit data-deadline in index.html
 *   Format: "YYYY-MM-DDTHH:MM:SS"  e.g. "2026-04-26T23:59:00"
 */

'use strict';

/* ──────────────────────────────────────────
   1. COUNTDOWN TIMER
   ──────────────────────────────────────────
   Reads deadline from .countdown-wrap[data-deadline]
   Updates every second.
   When expired: hides timer, shows "Акция завершена".
   ────────────────────────────────────────── */
(function initCountdown() {
  var wrap = document.querySelector('.countdown-wrap[data-deadline]');
  if (!wrap) return;

  // CHANGE HERE: fallback deadline if data-deadline attribute is missing
  var deadlineStr = wrap.getAttribute('data-deadline') || '2026-04-26T23:59:00';
  var deadline = new Date(deadlineStr).getTime();

  var elDays  = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMins  = document.getElementById('cd-mins');
  var elSecs  = document.getElementById('cd-secs');

  if (!elDays || !elHours || !elMins || !elSecs) return;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    var now  = Date.now();
    var diff = deadline - now;

    if (diff <= 0) {
      // Акция завершена
      wrap.innerHTML = '<p class="countdown-label" style="color:var(--text-mid);font-size:16px;">Акция завершена</p>';
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days    = Math.floor(totalSeconds / 86400);
    var hours   = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    elDays.textContent  = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent  = pad(minutes);
    elSecs.textContent  = pad(seconds);

    setTimeout(tick, 1000);
  }

  tick();
}());


/* ──────────────────────────────────────────
   2. SCROLL-REVEAL ANIMATIONS
   ──────────────────────────────────────────
   Uses IntersectionObserver to add .is-visible
   to elements marked with [data-animate].
   Falls back gracefully if Observer not supported.
   ────────────────────────────────────────── */
(function initScrollReveal() {
  var items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;

  // Stagger delay for grid children
  items.forEach(function(el, i) {
    var delay = (i % 4) * 80; // max 4 columns
    el.style.transitionDelay = delay + 'ms';
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    items.forEach(function(el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(function(el) {
    observer.observe(el);
  });
}());


/* ──────────────────────────────────────────
   3. SMOOTH SCROLL for anchor links
   ──────────────────────────────────────────
   Native html scroll-behavior handles most cases,
   this handles edge cases in older browsers.
   ────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}());

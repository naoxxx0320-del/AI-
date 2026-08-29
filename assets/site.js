/* すみだAIきょうしつ — shared behavior */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('nav.menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Scroll reveal */
  var items = document.querySelectorAll('.reveal');
  /* Elements already in view reveal immediately (no flash on load) */
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
  });
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* LINE button: appears when LINE_URL is set in assets/config.js */
  var cfg = window.SITE_CONFIG || {};
  if (cfg.LINE_URL) {
    document.querySelectorAll('[data-line-btn]').forEach(function (el) {
      el.setAttribute('href', cfg.LINE_URL);
      var holder = el.closest('[data-line-card]') || el;
      holder.hidden = false;
    });
  }
})();

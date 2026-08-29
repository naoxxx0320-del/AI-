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

  /* Contact form: posts to Google Forms when configured in assets/config.js,
     otherwise runs as a demo. */
  var cfg = window.SITE_CONFIG || {};
  var form = document.getElementById('contactForm');
  if (form) {
    var live = !!(cfg.GOOGLE_FORM_ACTION && cfg.GOOGLE_FORM_ENTRIES);
    var demoNote = document.getElementById('formDemoNote');
    if (live && demoNote) demoNote.hidden = true;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name');
      if (name && !name.value.trim()) {
        name.focus();
        name.style.borderColor = 'var(--kaki)';
        return;
      }
      var done = function (demo) {
        var thanks = document.getElementById('thanks');
        if (thanks) {
          thanks.textContent = demo
            ? 'ありがとうございます。お申し込みを受け付けました（デモ表示）。'
            : 'ありがとうございます。お申し込みを受け付けました。追ってご連絡いたします。';
          thanks.hidden = false;
        }
        var btn = form.querySelector('.btn');
        if (btn) { btn.textContent = '受け付けました'; btn.disabled = true; }
      };
      if (!live) { done(true); return; }

      var fd = new FormData();
      var map = cfg.GOOGLE_FORM_ENTRIES;
      Object.keys(map).forEach(function (key) {
        var el = document.getElementById(key);
        if (el) fd.append(map[key], el.value);
      });
      /* no-cors: Google Forms accepts the POST but returns an opaque response */
      fetch(cfg.GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: fd })
        .then(function () { done(false); })
        .catch(function () {
          var thanks = document.getElementById('thanks');
          if (thanks) {
            thanks.textContent = '送信できませんでした。お手数ですが、お電話でご連絡ください。';
            thanks.hidden = false;
          }
        });
    });
  }

  /* LINE button: appears when LINE_URL is set in assets/config.js */
  if (cfg.LINE_URL) {
    document.querySelectorAll('[data-line-btn]').forEach(function (el) {
      el.setAttribute('href', cfg.LINE_URL);
      var holder = el.closest('[data-line-card]') || el;
      holder.hidden = false;
    });
  }
})();

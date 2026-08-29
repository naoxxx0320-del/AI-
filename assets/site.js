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

  /* Contact form: posts to Web3Forms, then moves to thanks.html.
     The form's own action/method still work if this script fails to load. */
  var form = document.getElementById('contactForm');
  if (form) {
    var msg = document.getElementById('formMsg');
    var btn = document.getElementById('submitBtn');

    var show = function (kind, title, sub) {
      msg.className = 'form-msg ' + kind;
      msg.innerHTML = '';
      msg.appendChild(document.createTextNode(title));
      if (sub) {
        var s = document.createElement('span');
        s.className = 'sub';
        s.textContent = sub;
        msg.appendChild(s);
      }
      msg.hidden = false;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name');
      var tel = document.getElementById('tel');
      var missing = [name, tel].filter(function (el) { return !el.value.trim(); });
      if (missing.length) {
        missing.forEach(function (el) { el.style.borderColor = 'var(--kaki)'; });
        missing[0].focus();
        show('ng', 'お名前とお電話番号をご記入ください。',
          'このふたつだけあれば、こちらからご連絡できます。');
        return;
      }
      [name, tel].forEach(function (el) { el.style.borderColor = ''; });

      var fd = new FormData(form);
      /* 件名にお名前を入れて、受信箱で誰からか一目で分かるようにする */
      fd.set('subject', 'すみだAI教室 お申し込み（' + name.value.trim() + ' 様）');
      /* AJAX送信では redirect は使わないので、自分で移動する */
      fd.delete('redirect');

      btn.disabled = true;
      btn.textContent = '送信しています…';
      msg.hidden = true;

      fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.success) throw new Error(data.message || 'failed');
          btn.textContent = '送信しました';
          /* 完了ページへ移動（戻るボタンで再送信されないよう replace を使う） */
          window.location.replace('thanks.html');
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'もう一度送信する';
          show('ng', '送信できませんでした。',
            'お手数ですが、もう一度お試しいただくか、お電話・LINEでご連絡ください。');
        });
    });
  }
})();

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

  /* Contact form: sends to the owner's inbox via Web3Forms (see assets/config.js) */
  var form = document.getElementById('contactForm');
  if (form) {
    var msg = document.getElementById('formMsg');
    var btn = document.getElementById('submitBtn');
    var note = document.getElementById('formNote');

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

    /* Until the access key is set, say so plainly rather than dropping messages. */
    if (!cfg.FORM_ACCESS_KEY) {
      btn.disabled = true;
      if (note) note.hidden = true;
      show('ng', 'このフォームは準備中です。',
        'お手数ですが、お電話またはLINEでご連絡ください。すぐにお返事します。');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cfg.FORM_ACCESS_KEY) return;

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
      fd.append('access_key', cfg.FORM_ACCESS_KEY);
      fd.append('subject', 'すみだAI教室 お申し込み（' + name.value.trim() + ' 様）');
      fd.append('from_name', 'すみだAI教室 ウェブサイト');

      btn.disabled = true;
      btn.textContent = '送信しています…';
      msg.hidden = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.success) throw new Error(data.message || 'failed');
          form.querySelectorAll('input, select, textarea, fieldset').forEach(function (el) { el.disabled = true; });
          if (note) note.hidden = true;
          btn.textContent = '送信しました';
          show('ok', 'ありがとうございます。お申し込みを受け付けました。',
            '2〜3日以内に、ご記入のお電話番号にご連絡いたします。しばらくお待ちください。');
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

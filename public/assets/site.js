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

  /* ── 計測 ──
     GA4 の測定ID（G- で始まるもの）を assets/config.js に入れたときだけ動く。
     空のあいだは何も読み込まず、何も送らない。
     送るのはページの場所と講座の識別子だけ。氏名・電話番号・メール・
     自由記述・リンク先の電話番号は送らない。 */
  var GA = /^G-[A-Z0-9]+$/.test(cfg.GA_MEASUREMENT_ID || '') ? cfg.GA_MEASUREMENT_ID : '';
  if (GA) {
    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA);
  }
  /* done を渡すと、送信を待ってから呼ぶ（計測が無効なら即座に呼ぶ） */
  var track = function (name, params, done) {
    if (!GA || typeof window.gtag !== 'function') { if (done) done(); return; }
    var called = false;
    var finish = function () { if (!called) { called = true; if (done) done(); } };
    params = params || {};
    if (done) { params.event_callback = finish; setTimeout(finish, 800); }
    window.gtag('event', name, params);
  };
  var where = function (el) {
    if (el.closest('.bottombar')) return 'bottombar';
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.lesson-link')) return 'article_end';
    if (el.closest('.hero')) return 'hero';
    var sec = el.closest('section');
    var h = sec && sec.querySelector('h1[id], h2[id]');
    return (sec && sec.id) || (h && h.id) || 'body';
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/^tel:/.test(href)) {
      track('phone_click', { link_location: where(a) });       /* 発信の操作。通話成立ではない */
    } else if (/(^|\.)line\.me$/.test(a.hostname)) {
      track('line_click', { link_location: where(a) });        /* LINE を開いた操作。友だち追加ではない */
    } else if (a.host === location.host) {
      var m = a.pathname.match(/\/course\/([a-z-]+)\.html$/);
      if (m) track('course_detail_click', { course_id: m[1], link_location: where(a) });
    }
  });

  /* Contact form: posts to Web3Forms, then moves to thanks.html.
     The form's own action/method still work if this script fails to load. */
  var form = document.getElementById('contactForm');
  if (form) {
    var started = false;
    form.addEventListener('input', function () {
      if (started) return;
      started = true;
      track('contact_start');
    });
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
        missing.forEach(function (el) { el.style.borderColor = 'var(--danger)'; el.setAttribute('aria-invalid', 'true'); });
        missing[0].focus();
        show('ng', 'お名前とお電話番号をご記入ください。',
          'このふたつだけあれば、こちらからご連絡できます。');
        return;
      }
      [name, tel].forEach(function (el) { el.style.borderColor = ''; el.removeAttribute('aria-invalid'); });

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
          /* 送信先が成功を返したときだけ数える。thanks.html の表示では数えない */
          track('contact_success', { method: 'form' }, function () {
            window.location.replace('thanks.html');
          });
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

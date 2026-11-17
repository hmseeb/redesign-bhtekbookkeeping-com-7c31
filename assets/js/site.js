/* BH Tek Bookkeeping — site behaviour
   Progressive enhancement only: every page works without JS. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var FORM_ENDPOINT = 'https://vision.leadrai.com/api/forms/1665aa395145f8dc78e18823eb5dd302';

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector('[data-menu-btn]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      mobileNav.hidden = open;
      menuBtn.querySelector('[data-menu-label]').textContent = open ? 'Menu' : 'Close';
    });
  }

  /* ---------- desktop services dropdown ---------- */
  var subToggles = Array.prototype.slice.call(document.querySelectorAll('[data-submenu-toggle]'));

  function closeAllSubmenus(except) {
    subToggles.forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      var m = document.getElementById(t.getAttribute('aria-controls'));
      if (m) m.hidden = true;
    });
  }

  subToggles.forEach(function (toggle) {
    var menu = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!menu) return;

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var open = toggle.getAttribute('aria-expanded') === 'true';
      closeAllSubmenus(toggle);
      toggle.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });

    var wrapper = toggle.parentNode;
    wrapper.addEventListener('mouseenter', function () {
      if (window.matchMedia('(min-width: 1000px)').matches) {
        closeAllSubmenus(toggle);
        toggle.setAttribute('aria-expanded', 'true');
        menu.hidden = false;
      }
    });
    wrapper.addEventListener('mouseleave', function () {
      if (window.matchMedia('(min-width: 1000px)').matches) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
    wrapper.addEventListener('focusout', function (e) {
      if (!wrapper.contains(e.relatedTarget)) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllSubmenus(null);
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-submenu-wrap]')) closeAllSubmenus(null);
  });

  /* ---------- forms ---------- */
  var forms = Array.prototype.slice.call(document.querySelectorAll('form[data-leadr-form]'));
  var submitted = /(?:^|[?&])submitted=1(?:&|$)/.test(window.location.search);

  forms.forEach(function (form) {
    var pageField = form.querySelector('input[name="_page"]');
    if (pageField) pageField.value = window.location.href;

    var status = form.querySelector('[data-form-status]');
    var button = form.querySelector('button[type="submit"]');

    if (submitted && status) {
      status.hidden = false;
      status.classList.remove('is-error');
      status.textContent = 'Thanks, your message was sent. We typically respond within one business day.';
    }

    form.addEventListener('submit', function (e) {
      if (!window.fetch || !form.reportValidity) return; // let the browser post normally
      if (!form.reportValidity()) return;

      e.preventDefault();

      var data = {};
      new FormData(form).forEach(function (value, key) {
        if (typeof value !== 'string') return;
        data[key] = value;
      });
      data._page = window.location.href;

      var original = button ? button.textContent : '';
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending…';
      }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          return res.json().catch(function () { return { ok: true }; });
        })
        .then(function (json) {
          if (json && json.ok === false) throw new Error('Rejected');
          form.reset();
          if (pageField) pageField.value = window.location.href;
          if (status) {
            status.hidden = false;
            status.classList.remove('is-error');
            status.textContent = 'Thanks, your message was sent. We typically respond within one business day.';
            status.focus && status.focus();
          }
          if (button) {
            button.disabled = false;
            button.textContent = original;
          }
        })
        .catch(function () {
          if (button) {
            button.disabled = false;
            button.textContent = original;
          }
          if (status) {
            status.hidden = false;
            status.classList.add('is-error');
            status.textContent = 'Sorry — that did not send. Please try again, or call 713-304-5754 or email info@bhtekbookkeeping.com.';
            status.focus && status.focus();
          }
        });
    });
  });

  /* ---------- subtle reveal on scroll ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!revealables.length) return;

  if (reduce.matches || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  revealables.forEach(function (el) { io.observe(el); });
})();

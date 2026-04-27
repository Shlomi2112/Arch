/* ===================================================
   ARCH CRM — Landing Page Script
   =================================================== */

(function () {
  'use strict';

  /* ---------- State ---------- */
  let currentLang = 'he';

  /* ---------- Elements ---------- */
  const navbar      = document.getElementById('navbar');
  const langToggle  = document.getElementById('langToggle');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* ---------- Navbar scroll ---------- */
  function onScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hamburger menu ---------- */
  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', isOpen ? 'סגור תפריט ניווט' : 'פתח תפריט ניווט');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  /* ---------- Language toggle ---------- */
  function applyLanguage(lang) {
    currentLang = lang;
    const html = document.documentElement;

    if (lang === 'en') {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
      document.body.classList.add('lang-en');
      langToggle.textContent = 'עב';
      document.title = 'ARCH – Smart CRM for Real Estate';
    } else {
      html.setAttribute('lang', 'he');
      html.setAttribute('dir', 'rtl');
      document.body.classList.remove('lang-en');
      langToggle.textContent = 'EN';
      document.title = 'ARCH – מערכת CRM חכמה לנדל"ן';
    }

    // Update all elements with data-he / data-en attributes
    document.querySelectorAll('[data-he],[data-en]').forEach(function (el) {
      const text = el.getAttribute('data-' + lang);
      if (text !== null) {
        el.innerHTML = text;
      }
    });

    // Update input / textarea placeholders
    document.querySelectorAll('[data-he-placeholder],[data-en-placeholder]').forEach(function (el) {
      const ph = el.getAttribute('data-' + lang + '-placeholder');
      if (ph !== null) el.placeholder = ph;
    });
  }

  langToggle.addEventListener('click', function () {
    applyLanguage(currentLang === 'he' ? 'en' : 'he');
  });

  // Init placeholders on load
  applyLanguage('he');

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Contact form ---------- */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = currentLang === 'he' ? 'שולח...' : 'Sending...';

    const formData = new FormData(contactForm);

    fetch('https://formsubmit.co/support@arch-tech.co.il', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function () {
      contactForm.reset();
      btn.disabled = false;
      btn.textContent = currentLang === 'he' ? 'שלח ונחזור אליך' : "Send & We'll Call You";
      formSuccess.style.display = 'block';
      setTimeout(function () {
        formSuccess.style.display = 'none';
      }, 5000);
    })
    .catch(function () {
      btn.disabled = false;
      btn.textContent = currentLang === 'he' ? 'שלח ונחזור אליך' : "Send & We'll Call You";
      alert(currentLang === 'he' ? 'אירעה שגיאה, נסה שוב.' : 'An error occurred, please try again.');
    });
  });

  /* ---------- Scroll-reveal animation ---------- */
  /* ---------- Feature video carousel ---------- */
  (function () {
    var featureVideos = [
      { src: 'assets/usage_report.mp4',he: 'דוחות ואנליטיקס',    en: 'Reports & Analytics' },
      { src: 'assets/lidim.mp4',       he: 'ניהול לידים חכם',    en: 'Smart Lead Management' },
      { src: 'assets/nehasim.mp4',     he: 'מאגר נכסים מתקדם',   en: 'Advanced Property Database' },
      { src: 'assets/arch_ai.mp4',     he: 'אוטומציה חכמה',      en: 'Smart Automation' },
      { src: 'assets/yad2.mp4',        he: 'אינטגרציות מובנות',  en: 'Built-in Integrations' }
    ];
    var currentVideoIndex = 0;
    var videoEl  = document.getElementById('featureVideo');
    var labelEl  = document.getElementById('videoLabel');
    var dots     = document.querySelectorAll('.vpd');

    function loadFeatureVideo(index) {
      currentVideoIndex = index;
      var item = featureVideos[index];
      videoEl.src = item.src;
      videoEl.load();
      videoEl.play().catch(function () {});
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-pressed', i === index ? 'true' : 'false');
      });
      if (labelEl) {
        labelEl.dataset.he = item.he;
        labelEl.dataset.en = item.en;
        labelEl.textContent = currentLang === 'en' ? item.en : item.he;
      }
    }

    if (videoEl) {
      videoEl.addEventListener('ended', function () {
        loadFeatureVideo((currentVideoIndex + 1) % featureVideos.length);
      });
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          loadFeatureVideo(parseInt(this.dataset.index, 10));
        });
      });
    }
  }());

  const revealTargets = document.querySelectorAll(
    '.fcard, .audience-card, .step, .testimonial-card, .info-item'
  );

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    var delay = el.classList.contains('feature-row') ? '0s' : (i % 3 * 0.1) + 's';
    el.style.transition = 'opacity 0.6s ease ' + delay + ', transform 0.6s ease ' + delay;
    revealObserver.observe(el);
  });

  // Add revealed class effect via CSS
  document.head.insertAdjacentHTML('beforeend',
    '<style>.revealed { opacity: 1 !important; transform: translateY(0) !important; }</style>'
  );

  /* ---------- Modal helper ---------- */
  window.closeAgentModal = function () {
    var modal = document.getElementById('agentModal');
    modal.style.display = 'none';
    if (window._modalTrigger) { window._modalTrigger.focus(); window._modalTrigger = null; }
  };
  var agentModal = document.getElementById('agentModal');
  if (agentModal) {
    agentModal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { window.closeAgentModal(); }
    });
  }

  /* ---------- Video dot aria-pressed update ---------- */
  (function () {
    var origLoad = window._loadFeatureVideo;
  }());

  /* ---------- Cookie Consent ---------- */
  (function () {
    var banner  = document.getElementById('cookieBanner');
    var accept  = document.getElementById('cookieAccept');
    var decline = document.getElementById('cookieDecline');
    if (!banner) return;

    if (!localStorage.getItem('arch_cookie_consent')) {
      banner.hidden = false;
      setTimeout(function () { accept && accept.focus(); }, 350);
    }

    function dismiss(choice) {
      localStorage.setItem('arch_cookie_consent', choice);
      banner.hidden = true;
    }

    accept  && accept.addEventListener('click',  function () { dismiss('accepted'); });
    decline && decline.addEventListener('click', function () { dismiss('declined'); });

    banner.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { dismiss('declined'); }
    });
  }());

})();

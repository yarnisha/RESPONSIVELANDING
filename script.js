/* ============================================
   FLUX LANDING PAGE — script.js
============================================ */

// ── 1. NAV: scroll shadow
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();


// ── 2. HAMBURGER MENU
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  hamburger.addEventListener('click', () => {
    isOpen = !isOpen;
    mobileMenu.style.display = isOpen ? 'block' : 'none';
    hamburger.setAttribute('aria-expanded', isOpen);

    // Animate spans to X / back
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
      spans[1].style.cssText = 'opacity: 0';
      spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => (s.style.cssText = ''));
    }
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false;
      mobileMenu.style.display = 'none';
      hamburger.setAttribute('aria-expanded', false);
      hamburger.querySelectorAll('span').forEach(s => (s.style.cssText = ''));
    });
  });
})();


// ── 3. TYPEWRITER HERO
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Deliver better work.',
    'Focus on what matters.',
    'Ship without the chaos.',
    'Keep your team aligned.',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pausing   = false;

  const TYPING_SPEED  = 65;
  const DELETE_SPEED  = 35;
  const PAUSE_AFTER   = 1800;
  const PAUSE_BEFORE  = 320;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (pausing) return; // handled via setTimeout

    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === phrase.length) {
        // Finished typing — pause then delete
        pausing = true;
        setTimeout(() => {
          pausing  = false;
          deleting = true;
          requestAnimationFrame(loop);
        }, PAUSE_AFTER);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        // Finished deleting — move to next phrase
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pausing = true;
        setTimeout(() => {
          pausing = false;
          requestAnimationFrame(loop);
        }, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(() => requestAnimationFrame(loop), deleting ? DELETE_SPEED : TYPING_SPEED);
  }

  function loop() { tick(); }

  // Kick off after a short delay
  setTimeout(() => requestAnimationFrame(loop), 500);
})();


// ── 4. SCROLL REVEAL
(function () {
  // Elements to watch
  const targets = document.querySelectorAll(
    '.feature-card, .step, .testimonial, .plan, .hero__badge, .hero__sub, .hero__actions, .hero__social-proof, .section-title, .section-label, .cta-section__inner'
  );

  targets.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    targets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(entry.target.parentElement.children).filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();


// ── 5. PRICING TOGGLE
(function () {
  const toggle = document.getElementById('billingToggle');
  if (!toggle) return;

  const amounts = document.querySelectorAll('.plan__amount');

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    amounts.forEach(el => {
      const val = isAnnual ? el.dataset.annual : el.dataset.monthly;
      const numeric = !isNaN(parseFloat(val));
      el.textContent = numeric ? `$${val}` : val;
    });
  });
})();


// ── 6. SMOOTH ANCHOR SCROLL (offset for fixed nav)
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

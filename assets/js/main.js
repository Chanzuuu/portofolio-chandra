/**
 * DESIGN LAB JAVASCRIPT — CHANDRA ARYA FERDIYANSAH
 * Full Animation Suite:
 * - Lenis Inertia Smooth Scroll
 * - GSAP & ScrollTrigger Entrance & Stagger Reveals
 * - Running Hamster Preloader System Counter
 * - 3D Card Physics with Dynamic Holographic Glare
 * - Text Decryption / Hacker Scramble Effect
 * - Live Jakarta WIB (UTC+7) Clock
 */

document.addEventListener('DOMContentLoaded', () => {
  const lenis = initLenis();
  initPreloader(lenis);
  initTextScramble();
  initTiltPass();
  initLiveClock();
  initNav();
  initModal();
  initActions();
});

/* --------------------------------------------------------------------------
   1. LENIS SMOOTH INERTIA SCROLL
   -------------------------------------------------------------------------- */
function initLenis() {
  if (typeof Lenis === 'undefined') return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 2.0,
  });

  // Sync Lenis with GSAP ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  return lenis;
}

/* --------------------------------------------------------------------------
   2. PRELOADER COUNTER & HERO ENTRANCE (GSAP)
   -------------------------------------------------------------------------- */
function initPreloader(lenis) {
  const loader = document.getElementById('preloader');
  const countEl = document.getElementById('loader-count');
  const progressEl = document.getElementById('loader-progress');

  if (!loader || !countEl || !progressEl) return;

  let current = 0;
  const target = 100;
  const duration = 1400; // ms
  const interval = 20;
  const increment = target / (duration / interval);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
      countEl.textContent = '100%';
      progressEl.style.width = '100%';

      setTimeout(() => {
        if (typeof gsap !== 'undefined') {
          gsap.to(loader, {
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              loader.classList.add('is-done');
              triggerHeroEntrance();
              initScrollAnimations();
            }
          });
        } else {
          loader.classList.add('is-done');
          triggerHeroEntrance();
          initScrollAnimations();
        }
      }, 350);
    } else {
      const display = Math.floor(current).toString().padStart(3, '0');
      countEl.textContent = `${display}%`;
      progressEl.style.width = `${current}%`;
    }
  }, interval);
}

function triggerHeroEntrance() {
  if (typeof gsap === 'undefined') {
    triggerInitialScramble();
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      triggerInitialScramble();
    }
  });

  tl.from('.hero__welcome', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  })
  .from('.hero__title', {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: 'power4.out'
  }, '-=0.3')
  .from('.hero__role', {
    x: -20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero__tagline', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.4')
  .from('.hero__cta-row', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.4')
  .from('.lanyard-wrap', {
    y: -60,
    opacity: 0,
    rotateY: 20,
    duration: 1.1,
    ease: 'back.out(1.2)'
  }, '-=0.8');
}

/* --------------------------------------------------------------------------
   3. GSAP SCROLLTRIGGER REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Animate Section Tags (expanding line)
  gsap.utils.toArray('.section-tag').forEach(tag => {
    const line = tag.querySelector('.line');
    if (line) {
      gsap.from(line, {
        scaleX: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tag,
          start: 'top 85%'
        }
      });
    }
  });

  // Animate Section Headings
  gsap.utils.toArray('.section-head').forEach(head => {
    gsap.from(head, {
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: head,
        start: 'top 85%'
      }
    });
  });

  // Animate Project Plates (Staggered Slide Up)
  const plates = gsap.utils.toArray('.plate');
  if (plates.length) {
    gsap.from(plates, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.16,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects__list',
        start: 'top 80%'
      }
    });
  }

  // Animate Dossier Facts Matrix
  const factItems = gsap.utils.toArray('.fact-item');
  if (factItems.length) {
    gsap.from(factItems, {
      y: 25,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about__facts',
        start: 'top 85%'
      }
    });
  }

  // Animate Capability Cards
  const capCards = gsap.utils.toArray('.cap-card');
  if (capCards.length) {
    gsap.from(capCards, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.caps__grid',
        start: 'top 85%'
      }
    });
  }

  // Animate Contact Box
  const contactBox = document.querySelector('.contact-box');
  if (contactBox) {
    gsap.from(contactBox, {
      scale: 0.96,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: contactBox,
        start: 'top 85%'
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. TEXT DECRYPTION SCRAMBLE EFFECT
   -------------------------------------------------------------------------- */
const glyphs = 'ABCDEF0123456789//<>[]!@#$%^&*()_+-=~';

function scrambleText(element, finalText, speed = 25) {
  let iteration = 0;
  const original = finalText || element.innerText;

  const interval = setInterval(() => {
    element.innerText = original
      .split('')
      .map((letter, index) => {
        if (index < iteration) return original[index];
        return glyphs[Math.floor(Math.random() * glyphs.length)];
      })
      .join('');

    if (iteration >= original.length) {
      clearInterval(interval);
      element.innerText = original;
    }

    iteration += 1 / 2;
  }, speed);
}

function initTextScramble() {
  const decryptElements = document.querySelectorAll('[data-decrypt]');
  decryptElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      scrambleText(el, el.getAttribute('data-decrypt') || el.innerText);
    });
  });
}

function triggerInitialScramble() {
  const heroDecrypt = document.querySelector('.hero__decrypt');
  if (heroDecrypt) {
    scrambleText(heroDecrypt, heroDecrypt.innerText);
  }
  const glitch = document.querySelector('.glitch');
  if (glitch) {
    scrambleText(glitch, glitch.innerText);
  }
}

/* --------------------------------------------------------------------------
   5. 3D INTERACTIVE TILT PASS & DYNAMIC HOLOGRAPHIC GLARE
   -------------------------------------------------------------------------- */
function initTiltPass() {
  const pass = document.getElementById('access-pass');
  if (!pass) return;

  pass.addEventListener('mousemove', (e) => {
    const rect = pass.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    // Set holographic glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    pass.style.setProperty('--glare-x', `${glareX}%`);
    pass.style.setProperty('--glare-y', `${glareY}%`);

    pass.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    pass.style.boxShadow = `${-rotateY * 2.5}px ${rotateX * 2.5}px 45px rgba(255, 0, 168, 0.3)`;
  });

  pass.addEventListener('mouseleave', () => {
    pass.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    pass.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 0, 168, 0.1)';
    pass.style.setProperty('--glare-x', '50%');
    pass.style.setProperty('--glare-y', '50%');
  });
}

/* --------------------------------------------------------------------------
   6. LIVE JAKARTA WIB (UTC+7) CLOCK
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockEl = document.getElementById('wib-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeStr = now.toLocaleTimeString('id-ID', options);
    clockEl.textContent = `JKT // ${timeStr} WIB`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   7. NAVIGATION
   -------------------------------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const linksWrap = document.querySelector('.nav__links');
  const navLinks = document.querySelectorAll('.nav__link');

  if (toggle && linksWrap) {
    toggle.addEventListener('click', () => {
      linksWrap.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        linksWrap.classList.remove('open');
      });
    });
  }

  // Active section indicator
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(lnk => {
          lnk.classList.remove('active');
          if (lnk.getAttribute('href') === `#${id}`) {
            lnk.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. MODAL PREVIEW (CV DOKUMEN)
   -------------------------------------------------------------------------- */
function initModal() {
  const openBtns = document.querySelectorAll('[data-open-modal="cv-modal"]');
  const closeBtns = document.querySelectorAll('[data-close-modal]');
  const modal = document.getElementById('cv-modal');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* --------------------------------------------------------------------------
   9. ACTIONS: COPY TO CLIPBOARD
   -------------------------------------------------------------------------- */
function initActions() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(val).then(() => {
        showToast(`[TRANSMISSION] Copied: ${val}`);
      }).catch(() => {
        showToast('[ERROR] Failed to copy');
      });
    });
  });
}

/* Toast */
function showToast(msg, duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color: var(--accent);">></span> ${msg}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

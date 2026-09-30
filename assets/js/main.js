/**
 * DESIGN LAB JAVASCRIPT — CHANDRA ARYA FERDIYANSAH
 * Features: Preloader Counter, 3D Tilt Access Pass, Text Decrypt Scramble, WIB Live Clock, Modal & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTextScramble();
  initTiltPass();
  initLiveClock();
  initNav();
  initModal();
  initActions();
});

/* --------------------------------------------------------------------------
   1. SYSTEM PRELOADER COUNTER
   -------------------------------------------------------------------------- */
function initPreloader() {
  const loader = document.getElementById('preloader');
  const countEl = document.getElementById('loader-count');
  const progressEl = document.getElementById('loader-progress');

  if (!loader || !countEl || !progressEl) return;

  let current = 0;
  const target = 100;
  const duration = 1200; // ms
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
        loader.classList.add('is-done');
        triggerInitialScramble();
      }, 300);
    } else {
      const display = Math.floor(current).toString().padStart(3, '0');
      countEl.textContent = `${display}%`;
      progressEl.style.width = `${current}%`;
    }
  }, interval);
}

/* --------------------------------------------------------------------------
   2. TEXT DECRYPTION SCRAMBLE EFFECT
   -------------------------------------------------------------------------- */
const glyphs = 'ABCDEF0123456789//<>[]!@#$%^&*()_+-=~';

function scrambleText(element, finalText, speed = 30) {
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
}

/* --------------------------------------------------------------------------
   3. 3D INTERACTIVE TILT PASS
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
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    pass.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    pass.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(255, 0, 168, 0.25)`;
  });

  pass.addEventListener('mouseleave', () => {
    pass.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    pass.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 0, 168, 0.1)';
  });
}

/* --------------------------------------------------------------------------
   4. LIVE JAKARTA WIB (UTC+7) CLOCK
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockEl = document.getElementById('wib-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    // Jakarta is UTC+7
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
   5. NAVIGATION
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

  // Active section spy
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
   6. MODAL PREVIEW (CV DOKUMEN)
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
   7. ACTIONS: COPY & WHATSAPP GENERATOR
   -------------------------------------------------------------------------- */
function initActions() {
  // Copy to clipboard
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

  // Contact form to WhatsApp
  const form = document.getElementById('transmission-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('t-name').value.trim();
      const org = document.getElementById('t-org').value.trim();
      const message = document.getElementById('t-message').value.trim();

      if (!name || !message) {
        showToast('[VALIDATION] Required fields missing');
        return;
      }

      const waPhone = '6285211718008';
      const text = encodeURIComponent(
        `Halo Chandra Arya,\nSaya ${name} (${org || 'Pemberi Kerja'}).\n\nPesan:\n${message}`
      );
      showToast('[SYS] Initializing WhatsApp transmission...', 2500);

      setTimeout(() => {
        window.open(`https://wa.me/${waPhone}?text=${text}`, '_blank');
        form.reset();
      }, 700);
    });
  }
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

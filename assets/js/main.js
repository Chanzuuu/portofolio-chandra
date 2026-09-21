/**
 * PORTFOLIO JAVASCRIPT - CHANDRA ARYA FERDIYANSAH
 * Interactive UI/UX: Filters, Modals, Smooth Navigation, Form Actions & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initExperienceFilter();
  initStatsCounter();
  initModal();
  initContactForm();
  initCopyActions();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  }

  // Active section indicator
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. EXPERIENCE FILTER TABS
   -------------------------------------------------------------------------- */
function initExperienceFilter() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.experience-card');

  if (!tabButtons.length || !cards.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active class
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   3. ANIMATED STATS COUNTERS
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const isDecimal = stat.getAttribute('data-decimal') === 'true';
          const suffix = stat.getAttribute('data-suffix') || '';
          animateValue(stat, 0, target, 1500, isDecimal, suffix);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateValue(elem, start, end, duration, isDecimal, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * (end - start) + start;
      
      if (isDecimal) {
        elem.innerHTML = current.toFixed(2) + `<span class="accent">${suffix}</span>`;
      } else {
        elem.innerHTML = Math.floor(current) + `<span class="accent">${suffix}</span>`;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        if (isDecimal) {
          elem.innerHTML = end.toFixed(2) + `<span class="accent">${suffix}</span>`;
        } else {
          elem.innerHTML = end + `<span class="accent">${suffix}</span>`;
        }
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* --------------------------------------------------------------------------
   4. MODAL PREVIEW (CV & DOKUMEN)
   -------------------------------------------------------------------------- */
function initModal() {
  const openModalBtns = document.querySelectorAll('[data-open-modal="cv-modal"]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  const modalBackdrop = document.getElementById('cv-modal');

  if (!modalBackdrop) return;

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal();
    });
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   5. CONTACT FORM & WHATSAPP GENERATOR
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Harap lengkapi semua kolom formulir.');
      return;
    }

    // Format WhatsApp message
    const waPhone = '6285211718008';
    const waText = encodeURIComponent(
      `Halo Chandra Arya,\n\nSaya ${name} (${email}).\nPerihal: ${subject || 'Peluang Karir/Kerjasama'}\n\nPesan:\n${message}`
    );
    const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

    showToast('✨ Pesan disiapkan! Membuka WhatsApp untuk terhubung...', 3000);

    setTimeout(() => {
      window.open(waUrl, '_blank');
      form.reset();
    }, 800);
  });
}

/* --------------------------------------------------------------------------
   6. COPY TO CLIPBOARD ACTIONS
   -------------------------------------------------------------------------- */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`📋 Berhasil disalin: ${textToCopy}`);
      }).catch(() => {
        showToast('Gagal menyalin teks.');
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message, duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}


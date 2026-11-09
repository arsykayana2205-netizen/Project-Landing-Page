(() => {
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  const revealItems = document.querySelectorAll([
    '.reveal',
    '.hero-copy > *',
    '.collection-foot',
    '.menu-filter',
    '.menu-column-heading',
    '.menu-item',
    '.menu-note',
    '.process-step',
    '.space-title',
    '.space-note',
    '.pairing-photo',
    '.pairing-card',
    '.detail-grid > div',
    '.contact-links-list > *',
    '.final-cta > *',
    '.footer-top > *',
    '.footer-bottom > *'
  ].join(', '));
  revealItems.forEach((item) => item.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const hero = document.querySelector('.hero');
  const heroArt = document.querySelector('.hero-art');
  const heroProduct = document.querySelector('.hero-product');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hero && heroArt && heroProduct && canHover && !reduceMotion) {
    heroArt.addEventListener('pointermove', (event) => {
      const bounds = heroArt.getBoundingClientRect();
      const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
      const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
      heroProduct.style.setProperty('--tilt-x', `${-y * 10}deg`);
      heroProduct.style.setProperty('--tilt-y', `${x * 14}deg`);
    });

    heroArt.addEventListener('pointerleave', () => {
      heroProduct.style.setProperty('--tilt-x', '0deg');
      heroProduct.style.setProperty('--tilt-y', '0deg');
    });
  }

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.getAttribute('data-add') || 'Your coffee';
      showToast(`${productName} added to your order list.`);
      button.classList.add('just-added');
      window.setTimeout(() => button.classList.remove('just-added'), 450);
    });
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const menuColumns = document.querySelectorAll('.menu-column[data-category]');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      menuColumns.forEach((column) => {
        const shouldShow = filter === 'all' || column.dataset.category === filter;
        column.classList.toggle('is-hidden', !shouldShow);
      });
    });
  });
  
  const newsletterForm = document.getElementById('newsletterForm');
  const formMessage = document.getElementById('formMessage');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.checkValidity()) {
        emailInput?.reportValidity();
        return;
      }
      if (formMessage) formMessage.textContent = 'Thank you — you are on the Ravenna update list (demo).';
      showToast('Thanks for joining the Ravenna list.');
      newsletterForm.reset();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', targetId);
    });
  });
})();

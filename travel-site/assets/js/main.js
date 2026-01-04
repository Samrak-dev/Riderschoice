(function () {
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  };

  if (burger && drawer) {
    burger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
      
      // Ensure proper focus management
      if (isOpen) {
        drawer.focus();
        // Add keyboard support for closing menu with Escape key
        const handleEsc = (event) => {
          if (event.key === 'Escape') {
            closeDrawer();
            burger.focus();
          }
        };
        document.addEventListener('keydown', handleEsc, { once: true });
      }
    });

    // Close menu when user taps a link (mobile UX)
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        // Only close if it's a navigation link (not a button)
        if (a.tagName === 'A' && !a.classList.contains('btn')) {
          closeDrawer();
        }
      });
    });

    // If user rotates or resizes to desktop, close the drawer
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 980) closeDrawer();
    });
  }

  // Set aria-current for active nav link
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('header nav a[href]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  // Simple lightbox for galleries
  const lb = document.querySelector('[data-lightbox]');
  const lbImg = document.querySelector('[data-lightbox-img]');
  const lbClose = document.querySelector('[data-lightbox-close]');
  if (lb && lbImg) {
    document.querySelectorAll('[data-gallery] a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const img = link.querySelector('img');
        const src = link.getAttribute('href');
        lbImg.src = src;
        lbImg.alt = img?.alt || 'Gallery image';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const close = () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
    };

    lbClose?.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // Contact form -> mailto fallback (no backend needed)
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (form.querySelector('[name="name"]')?.value || '').trim();
      const phone = (form.querySelector('[name="phone"]')?.value || '').trim();
      const email = (form.querySelector('[name="email"]')?.value || '').trim();
      const message = (form.querySelector('[name="message"]')?.value || '').trim();

      if (!name || !phone || !message) {
        if (status) status.textContent = 'Please fill Name, Phone and Message.';
        return;
      }

      const to = 'yourbusiness@email.com';
      const subject = encodeURIComponent('New enquiry: Scooty Rental / Homestay');
      const body = encodeURIComponent(
        `Name: ${name}
Phone: ${phone}
Email: ${email}

Message:
${message}
`
      );

      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      if (status) status.textContent = 'Opening your email app… If it doesn’t open, please WhatsApp or call us.';
      form.reset();
    });
  }
})();
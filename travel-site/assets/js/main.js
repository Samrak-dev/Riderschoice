(function () {
  'use strict';

  // Simple, direct mobile menu toggle
  function setupMobileMenu() {
    const burger = document.querySelector('[data-burger]');
    const drawer = document.querySelector('[data-drawer]');

    if (!burger || !drawer) {
      console.error('Mobile menu elements not found:', { burger, drawer });
      return false;
    }

    console.log('Mobile menu initialized', { burger, drawer });

    // Mark as initialized
    burger.setAttribute('data-menu-initialized', 'true');

    function restoreScroll() {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (window.menuScrollY !== undefined) {
        window.scrollTo(0, window.menuScrollY);
        window.menuScrollY = undefined;
      }
    }

    // Simple toggle function
    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      const isOpen = drawer.classList.contains('open');
      
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      // Prevent page scroll but allow drawer to scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Store scroll position for restoration
      window.menuScrollY = scrollY;
      
      // Open drawer with animation
      drawer.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      
      // Ensure drawer can scroll
      drawer.style.overflowY = 'auto';
      drawer.style.overflowX = 'hidden';
      
      console.log('Menu opened');
    }

    function closeMenu() {
      drawer.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      restoreScroll();
      console.log('Menu closed');
    }

    // Use onclick for maximum compatibility
    burger.onclick = toggleMenu;

    // Close menu when clicking close button
    const closeButton = drawer.querySelector('[data-drawer-close]');
    if (closeButton) {
      closeButton.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      };
    }

    // Close menu when clicking links
    drawer.querySelectorAll('a').forEach(function(link) {
      link.onclick = function() {
        // Small delay for better UX
        setTimeout(function() {
          closeMenu();
        }, 100);
      };
    });

    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeMenu();
        burger.focus();
      }
    });

    // Close menu when resizing to desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth >= 980 && drawer.classList.contains('open')) {
          closeMenu();
        }
      }, 150);
    });

    // Close menu when clicking on drawer background (not on links)
    drawer.addEventListener('click', function(e) {
      if (e.target === drawer || (e.target.classList.contains('mobile-drawer') && !e.target.closest('.nav'))) {
        closeMenu();
      }
    });

    return true;
  }

  // Initialize immediately (script has defer, so DOM is ready)
  setupMobileMenu();
  
  // Also try on DOMContentLoaded as backup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileMenu);
  }
  
  // Final fallback: try again after a short delay
  setTimeout(function() {
    const burger = document.querySelector('[data-burger]');
    if (burger && !burger.hasAttribute('data-menu-initialized')) {
      burger.setAttribute('data-menu-initialized', 'true');
      setupMobileMenu();
    }
  }, 100);

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

      if (status) status.textContent = 'Opening your email app. If it doesn\'t open, please WhatsApp or call us.';
      form.reset();
    });
  }
})();

/* ===================================================================
   British English Bootcamp — Main JavaScript
   Navigation toggle, scroll effects, smooth UX
   =================================================================== */

(function () {
    'use strict';

    // --- DOM refs ---
    const nav = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navLinkEls = document.querySelectorAll('.nav__link');

    // --- Mobile menu toggle ---
    if (toggle && links) {
        toggle.addEventListener('click', function () {
            const isOpen = links.classList.toggle('nav__links--open');
            toggle.classList.toggle('nav__toggle--active');
            toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });
    }

    // --- Close mobile menu on link click ---
    navLinkEls.forEach(function (link) {
        link.addEventListener('click', function () {
            if (links && links.classList.contains('nav__links--open')) {
                links.classList.remove('nav__links--open');
                toggle.classList.remove('nav__toggle--active');
                toggle.setAttribute('aria-label', 'Open navigation menu');
            }
        });
    });

    // --- Scroll shadow on navbar ---
    function handleScroll() {
        if (window.scrollY > 40) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    // --- Smooth scroll for anchor links (fallback) ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });

                // Update URL hash without scroll jump
                history.pushState(null, '', targetId);
            }
        });
    });

    // --- Intersection Observer for fade-in animations (progressive enhancement) ---
    if ('IntersectionObserver' in window) {
        const animElements = document.querySelectorAll(
            '.feature-card, .age-band, .timeline__step, ' +
            '.testimonial-card, .pricing-card, .cert-level'
        );

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        animElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // --- Keyboard trap helper (close menu on Escape) ---
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && links && links.classList.contains('nav__links--open')) {
            links.classList.remove('nav__links--open');
            toggle.classList.remove('nav__toggle--active');
            toggle.setAttribute('aria-label', 'Open navigation menu');
            toggle.focus();
        }
    });

})();
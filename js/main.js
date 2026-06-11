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

    // --- Currency toggle (GBP/USD) ---
    const currencySwitch = document.getElementById('currencySwitch');
    const currencyLabels = document.querySelectorAll('.currency-toggle__label');
    const priceAmounts = document.querySelectorAll('.pricing-card__amount');
    const priceCurrencies = document.querySelectorAll('.pricing-card__currency');
    const priceCards = document.querySelectorAll('.pricing-card');

    if (currencySwitch) {
        let isUSD = false;

        function setCurrency(showUSD) {
            isUSD = showUSD;

            // Toggle switch visual
            currencySwitch.classList.toggle('currency-toggle__switch--usd', isUSD);
            currencySwitch.setAttribute('aria-checked', isUSD ? 'true' : 'false');

            // Update labels
            currencyLabels.forEach(function (label) {
                const curr = label.getAttribute('data-currency');
                if (curr === 'gbp' && !isUSD) {
                    label.classList.add('currency-toggle__label--active');
                } else if (curr === 'usd' && isUSD) {
                    label.classList.add('currency-toggle__label--active');
                } else {
                    label.classList.remove('currency-toggle__label--active');
                }
            });

            // Update price amounts
            priceCards.forEach(function (card) {
                const amountEl = card.querySelector('.pricing-card__amount');
                const currencyEl = card.querySelector('.pricing-card__currency');
                if (amountEl && currencyEl) {
                    if (isUSD) {
                        currencyEl.textContent = "$";
                        amountEl.textContent = amountEl.getAttribute('data-usd');
                    } else {
                        currencyEl.textContent = '\u00A3';
                        amountEl.textContent = amountEl.getAttribute('data-gbp');
                    }
                }
            });
        }

        // Click toggle
        currencySwitch.addEventListener('click', function () {
            setCurrency(!isUSD);
        });

        // Keyboard support
        currencySwitch.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                setCurrency(e.key === 'ArrowRight');
            }
        });
    }

    // --- Enrolment Modal ---
    const modal = document.getElementById('enrolModal');
    const overlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const enrolForm = document.getElementById('enrolForm');
    const formBand = document.getElementById('formBand');
    const successEl = document.getElementById('enrolSuccess');
    const successClose = document.getElementById('successClose');
    let focusableElements = null;

    // Open modal on Enrol button click
    document.querySelectorAll('[data-enrol]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var band = this.getAttribute('data-enrol');

            if (formBand) formBand.value = band;

            var bandName = {
                explorer: 'Explorer (Ages 4\u20137)',
                achiever: 'Achiever (Ages 8\u201310)',
                laureate: 'Laureate (Ages 11\u201313)'
            }[band] || '';

            if (modalSubtitle) {
                modalSubtitle.textContent = bandName
                    ? 'Secure your spot in the ' + bandName + ' programme.'
                    : "Secure your child's spot in our next cohort.";
            }

            openModal();
        });
    });

    function openModal() {
        if (!modal) return;
        modal.classList.add('modal--open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (successEl) successEl.classList.remove('enrol-success--visible');
        if (enrolForm) enrolForm.style.display = '';

        setTimeout(function () {
            var first = modal.querySelector('input, select');
            if (first) first.focus();
        }, 100);

        focusableElements = modal.querySelectorAll(
            'input, select, button, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('modal--open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    if (successClose) successClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('modal--open')) {
            closeModal();
        }

        if (e.key === 'Tab' && modal && modal.classList.contains('modal--open') && focusableElements && focusableElements.length) {
            var first = focusableElements[0];
            var last = focusableElements[focusableElements.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Form validation & submission
    if (enrolForm) {
        var fields = {
            parent: { el: document.getElementById('formParent'), err: document.getElementById('errorParent') },
            email: { el: document.getElementById('formEmail'), err: document.getElementById('errorEmail') },
            child: { el: document.getElementById('formChild'), err: document.getElementById('errorChild') },
            band: { el: document.getElementById('formBand'), err: document.getElementById('errorBand') },
            cohort: { el: document.getElementById('formCohort'), err: document.getElementById('errorCohort') }
        };

        function validate(key) {
            var f = fields[key];
            if (!f || !f.el) return true;
            var val = (f.el.value || '').trim();
            var ok = true;
            if (key === 'email') {
                ok = val.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            } else if (key === 'parent' || key === 'child') {
                ok = val.length >= 2;
            } else {
                ok = val !== '';
            }
            if (!ok) {
                f.el.classList.add('form__input--error');
                if (f.err) f.err.classList.add('form__error--visible');
            } else {
                f.el.classList.remove('form__input--error');
                if (f.err) f.err.classList.remove('form__error--visible');
            }
            return ok;
        }

        Object.keys(fields).forEach(function (key) {
            var f = fields[key];
            if (f && f.el) {
                f.el.addEventListener('blur', function () { validate(key); });
                f.el.addEventListener('input', function () {
                    f.el.classList.remove('form__input--error');
                    if (f.err) f.err.classList.remove('form__error--visible');
                });
            }
        });

        enrolForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var allOk = true;
            Object.keys(fields).forEach(function (key) {
                if (!validate(key)) allOk = false;
            });
            if (!allOk) return;

            var data = {
                parent_name: fields.parent.el.value.trim(),
                email: fields.email.el.value.trim(),
                child_name: fields.child.el.value.trim(),
                age_band: fields.band.el.value,
                cohort: fields.cohort.el.value,
                timestamp: new Date().toISOString()
            };

            var enrolments = JSON.parse(localStorage.getItem('bootcamp_enrolments') || '[]');
            enrolments.push(data);
            localStorage.setItem('bootcamp_enrolments', JSON.stringify(enrolments));

            enrolForm.style.display = 'none';
            if (successEl) successEl.classList.add('enrol-success--visible');
            enrolForm.reset();
        });
    }

// --- WeChat QR toggle for touch devices ---
    var wechatIcon = document.getElementById('wechatIcon');
    var wechatQR = document.getElementById('wechatQR');
    if (wechatIcon && wechatQR) {
        wechatIcon.addEventListener('click', function (e) {
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                e.preventDefault();
                var isVisible = wechatQR.style.display === 'block';
                wechatQR.style.display = isVisible ? '' : 'block';
            }
        });

        document.addEventListener('click', function (e) {
            if (!wechatIcon.contains(e.target) && wechatQR.style.display === 'block') {
                wechatQR.style.display = '';
            }
        });
    }

})();
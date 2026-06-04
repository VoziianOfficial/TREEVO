'use strict';

(function () {
    const serviceHeroMap = {
        'tree-removal.html': {
            heroClass: 'service-hero--tree-removal',
            image: 'assets/images/tree-removal-hero.jpg'
        },
        'emergency-tree-removal.html': {
            heroClass: 'service-hero--emergency',
            image: 'assets/images/emergency-tree-removal.jpg'
        },
        'tree-trimming-pruning.html': {
            heroClass: 'service-hero--trimming',
            image: 'assets/images/tree-trimming.jpg'
        },
        'stump-grinding-removal.html': {
            heroClass: 'service-hero--stump',
            image: 'assets/images/stump-grinding.jpg'
        },
        'land-lot-clearing.html': {
            heroClass: 'service-hero--land',
            image: 'assets/images/land-clearing.jpg'
        },
        'tree-health-risk-assessment.html': {
            heroClass: 'service-hero--risk',
            image: 'assets/images/tree-risk-assessment.jpg'
        }
    };

    function getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    function initServiceHeroFallback() {
        const hero = document.querySelector('.service-hero');
        const currentPage = getCurrentPage();
        const serviceData = serviceHeroMap[currentPage];

        if (!hero || !serviceData) return;

        const image = new Image();

        image.src = serviceData.image;

        image.onerror = () => {
            hero.classList.add('service-hero--missing-image');

            hero.style.background = `
                var(--gradient-hero),
                radial-gradient(circle at 20% 40%, rgba(214, 170, 88, 0.18), transparent 34%),
                linear-gradient(135deg, #101006 0%, #2E2617 48%, #544233 100%)
            `;
        };
    }

    function initCurrentServiceState() {
        const currentPage = getCurrentPage();

        const serviceLinks = document.querySelectorAll(
            `.nav-dropdown__link[href="${currentPage}"],
             .mobile-menu__service-link[href="${currentPage}"],
             .site-footer__links a[href="${currentPage}"]`
        );

        serviceLinks.forEach((link) => {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
        });
    }

    function initServiceLineHover() {
        const rows = document.querySelectorAll('.line-list__item, .quote-factor, .service-process__step');

        rows.forEach((row) => {
            row.addEventListener('mouseenter', () => {
                row.classList.add('is-hovered');
            });

            row.addEventListener('mouseleave', () => {
                row.classList.remove('is-hovered');
            });

            row.addEventListener('focusin', () => {
                row.classList.add('is-hovered');
            });

            row.addEventListener('focusout', () => {
                row.classList.remove('is-hovered');
            });
        });
    }

    function initServiceMetaAnimation() {
        const metaItems = document.querySelectorAll('.hero__meta-item');

        metaItems.forEach((item, index) => {
            item.style.setProperty('--meta-delay', `${index * 90}ms`);
            item.classList.add('is-ready');
        });
    }

    function initQuoteFactorAnimation() {
        const factors = document.querySelectorAll('.quote-factor');

        if (!factors.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            factors.forEach((factor) => factor.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -12% 0px',
                threshold: 0.12
            }
        );

        factors.forEach((factor, index) => {
            factor.style.setProperty('--factor-delay', `${index * 70}ms`);
            observer.observe(factor);
        });
    }

    function initProcessAnimation() {
        const steps = document.querySelectorAll('.service-process__step');

        if (!steps.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            steps.forEach((step) => step.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -14% 0px',
                threshold: 0.16
            }
        );

        steps.forEach((step, index) => {
            step.style.setProperty('--step-delay', `${index * 110}ms`);
            observer.observe(step);
        });
    }

    function initServiceFormPreselectLinks() {
        const contactLinks = document.querySelectorAll('a[href="contact.html#contact-form"]');
        const pageTitle = document.querySelector('.page-hero__title');

        if (!pageTitle || !contactLinks.length) return;

        const serviceName = pageTitle.textContent
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^Compare\s+/i, '')
            .replace(/\s+Options$/i, '');

        contactLinks.forEach((link) => {
            const originalHref = link.getAttribute('href');

            if (!originalHref || originalHref.includes('?service=')) return;

            link.setAttribute(
                'href',
                `contact.html?service=${encodeURIComponent(serviceName)}#contact-form`
            );
        });
    }

    function init() {
        initServiceHeroFallback();
        initCurrentServiceState();
        initServiceLineHover();
        initServiceMetaAnimation();
        initQuoteFactorAnimation();
        initProcessAnimation();
        initServiceFormPreselectLinks();

        if (window.TREEVO && typeof window.TREEVO.refreshIcons === 'function') {
            window.TREEVO.refreshIcons();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
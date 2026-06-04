'use strict';

(function () {
    function getHeaderOffset() {
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;

        return headerHeight + 18;
    }

    function initLegalSmoothScroll() {
        const links = document.querySelectorAll(
            '.legal-sidebar__nav a[href^="#"], .wood-trail__link[href^="#"]'
        );

        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');

                if (!href || href === '#') return;

                const target = document.querySelector(href);

                if (!target) return;

                event.preventDefault();

                const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });

                history.replaceState(null, '', href);
            });
        });
    }

    function initLegalActiveNavigation() {
        const sections = Array.from(
            document.querySelectorAll('.legal-document__intro[id], .legal-section[id]')
        );

        const sidebarLinks = Array.from(document.querySelectorAll('.legal-sidebar__nav a[href^="#"]'));
        const trailLinks = Array.from(document.querySelectorAll('.wood-trail__link[href^="#"]'));

        if (!sections.length) return;

        const setActiveLink = (id) => {
            sidebarLinks.forEach((link) => {
                const isActive = link.getAttribute('href') === `#${id}`;

                link.classList.toggle('is-active', isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

            trailLinks.forEach((link) => {
                const isActive = link.getAttribute('href') === `#${id}`;

                link.classList.toggle('is-active', isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (!visibleEntries.length) return;

                setActiveLink(visibleEntries[0].target.id);
            },
            {
                root: null,
                rootMargin: '-24% 0px -62% 0px',
                threshold: [0.12, 0.24, 0.36, 0.5]
            }
        );

        sections.forEach((section) => observer.observe(section));

        const firstSection = sections[0];

        if (firstSection) {
            setActiveLink(firstSection.id);
        }
    }

    function initLegalTableLabels() {
        const tables = document.querySelectorAll('.legal-table');

        tables.forEach((table) => {
            const headers = Array.from(table.querySelectorAll('thead th')).map((header) =>
                header.textContent.trim()
            );

            const rows = table.querySelectorAll('tbody tr');

            rows.forEach((row) => {
                const cells = row.querySelectorAll('td');

                cells.forEach((cell, index) => {
                    if (headers[index]) {
                        cell.setAttribute('data-label', headers[index]);
                    }
                });
            });
        });
    }

    function initLegalExternalLinks() {
        const links = document.querySelectorAll('.legal-document a[href^="http"]');

        links.forEach((link) => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    function initLegalHashOffset() {
        if (!window.location.hash) return;

        const target = document.querySelector(window.location.hash);

        if (!target) return;

        window.setTimeout(() => {
            const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

            window.scrollTo({
                top,
                behavior: 'auto'
            });
        }, 80);
    }

    function initLegalDocumentReveal() {
        const documentBox = document.querySelector('.legal-document');

        if (!documentBox) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            documentBox.classList.add('is-visible');
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
                threshold: 0.14
            }
        );

        observer.observe(documentBox);
    }

    function init() {
        initLegalSmoothScroll();
        initLegalActiveNavigation();
        initLegalTableLabels();
        initLegalExternalLinks();
        initLegalHashOffset();
        initLegalDocumentReveal();

        if (window.TREEVO && typeof window.TREEVO.refreshIcons === 'function') {
            window.TREEVO.refreshIcons();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
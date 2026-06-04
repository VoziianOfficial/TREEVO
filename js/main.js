'use strict';

(function () {
    const CONFIG = window.SITE_CONFIG || {};

    const selectors = {
        header: '.site-header',
        headerShell: '.site-header__shell',
        mobileMenu: '.mobile-menu',
        menuToggle: '[data-menu-toggle]',
        menuClose: '[data-menu-close]',
        dropdownParent: '.nav-item--has-dropdown',
        dropdown: '.nav-dropdown',
        woodTrail: '.wood-trail',
        trailLink: '[data-trail-link]',
        cookieBanner: '[data-cookie-banner]',
        cookieAccept: '[data-cookie-accept]',
        cookieDecline: '[data-cookie-decline]',
        accordionButton: '[data-accordion-button]'
    };

    const state = {
        dropdownTimer: null,
        lastFocusedElement: null
    };

    function getConfigValue(path) {
        if (!path || typeof path !== 'string') return '';

        return path.split('.').reduce((current, key) => {
            if (current && Object.prototype.hasOwnProperty.call(current, key)) {
                return current[key];
            }

            return '';
        }, CONFIG);
    }

    function applyConfigValues() {
        const textNodes = document.querySelectorAll('[data-config]');
        const htmlNodes = document.querySelectorAll('[data-config-html]');
        const phoneLinks = document.querySelectorAll('[data-phone-link]');
        const emailLinks = document.querySelectorAll('[data-email-link]');
        const currentYearNodes = document.querySelectorAll('[data-current-year]');

        textNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.config);

            if (value !== undefined && value !== null) {
                node.textContent = value;
            }
        });

        htmlNodes.forEach((node) => {
            const value = getConfigValue(node.dataset.configHtml);

            if (value !== undefined && value !== null) {
                node.innerHTML = value;
            }
        });

        phoneLinks.forEach((link) => {
            const phoneRaw = getConfigValue('contact.phoneRaw');
            const phoneDisplay = getConfigValue('contact.phoneDisplay');
            const phoneButtonText = getConfigValue('contact.phoneButtonText');

            const isIconOnlyLink =
                link.classList.contains('icon-button') ||
                link.querySelector('[data-lucide]') ||
                link.querySelector('svg');

            if (phoneRaw) {
                link.setAttribute('href', `tel:${phoneRaw}`);
            }

            if (!isIconOnlyLink && !link.textContent.trim()) {
                link.textContent = phoneDisplay || phoneButtonText || 'Call Now';
            }

            link.setAttribute('aria-label', `Call ${phoneDisplay || phoneRaw || 'TREEVO'}`);
        });

        emailLinks.forEach((link) => {
            const email = getConfigValue('contact.email');

            const isIconOnlyLink =
                link.classList.contains('icon-button') ||
                link.querySelector('[data-lucide]') ||
                link.querySelector('svg');

            if (email) {
                link.setAttribute('href', `mailto:${email}`);
            }

            if (!isIconOnlyLink && !link.textContent.trim()) {
                link.textContent = email || 'Email TREEVO';
            }

            link.setAttribute('aria-label', `Email ${email || 'TREEVO'}`);
        });
    }

    function initLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function initStickyHeader() {
        const header = document.querySelector(selectors.header);
        const woodTrail = document.querySelector(selectors.woodTrail);

        if (!header) return;

        const updateHeaderState = () => {
            const scrolled = window.scrollY > 16;
            const showTrail = window.scrollY > 180;

            header.classList.toggle('is-scrolled', scrolled);
            document.body.classList.toggle('has-scrolled-header', scrolled);

            if (woodTrail) {
                woodTrail.classList.toggle('is-visible', showTrail);
            }
        };

        updateHeaderState();

        window.addEventListener('scroll', updateHeaderState, {
            passive: true
        });
    }

    function getFocusableElements(container) {
        return Array.from(
            container.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        );
    }

    function initMobileMenu() {
        const toggle = document.querySelector(selectors.menuToggle);
        const menu = document.querySelector(selectors.mobileMenu);
        const closeButtons = document.querySelectorAll(selectors.menuClose);

        if (!toggle || !menu) return;

        const openMenu = () => {
            state.lastFocusedElement = document.activeElement;

            menu.classList.add('is-open');
            document.body.classList.add('menu-is-open');
            toggle.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');

            const focusable = getFocusableElements(menu);

            if (focusable.length) {
                focusable[0].focus();
            }
        };

        const closeMenu = () => {
            menu.classList.remove('is-open');
            document.body.classList.remove('menu-is-open');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');

            if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
                state.lastFocusedElement.focus();
            }
        };

        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.contains('is-open');

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        closeButtons.forEach((button) => {
            button.addEventListener('click', closeMenu);
        });

        menu.addEventListener('click', (event) => {
            const link = event.target.closest('a');

            if (link) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (!menu.classList.contains('is-open')) return;

            if (event.key === 'Escape') {
                closeMenu();
            }

            if (event.key === 'Tab') {
                const focusable = getFocusableElements(menu);

                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }

                if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    }

    function initDropdownNavigation() {
        const dropdownItems = document.querySelectorAll(selectors.dropdownParent);

        dropdownItems.forEach((item) => {
            const dropdown = item.querySelector(selectors.dropdown);
            const trigger = item.querySelector('a, button');

            if (!dropdown || !trigger) return;

            const openDropdown = () => {
                window.clearTimeout(state.dropdownTimer);
                item.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            };

            const closeDropdown = () => {
                state.dropdownTimer = window.setTimeout(() => {
                    item.classList.remove('is-open');
                    trigger.setAttribute('aria-expanded', 'false');
                }, 220);
            };

            item.addEventListener('mouseenter', openDropdown);
            item.addEventListener('mouseleave', closeDropdown);

            item.addEventListener('focusin', openDropdown);
            item.addEventListener('focusout', (event) => {
                if (!item.contains(event.relatedTarget)) {
                    closeDropdown();
                }
            });

            trigger.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    openDropdown();

                    const firstDropdownLink = dropdown.querySelector('a');

                    if (firstDropdownLink) {
                        firstDropdownLink.focus();
                    }
                }

                if (event.key === 'Escape') {
                    item.classList.remove('is-open');
                    trigger.setAttribute('aria-expanded', 'false');
                    trigger.focus();
                }
            });
        });
    }

    function getHeaderOffset() {
        const header = document.querySelector(selectors.header);
        const headerHeight = header ? header.offsetHeight : 0;

        return headerHeight + 18;
    }

    function scrollToTarget(target) {
        if (!target) return;

        const offset = getHeaderOffset();
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    }

    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');

        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                const id = link.getAttribute('href');
                const target = document.querySelector(id);

                if (!target) return;

                event.preventDefault();
                scrollToTarget(target);
                history.pushState(null, '', id);
            });
        });

        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);

            if (target) {
                window.setTimeout(() => {
                    scrollToTarget(target);
                }, 180);
            }
        }
    }

    function initWoodTrailActiveState() {
        const trailLinks = document.querySelectorAll(selectors.trailLink);

        if (!trailLinks.length) return;

        const sections = Array.from(trailLinks)
            .map((link) => {
                const hash = link.getAttribute('href');

                if (!hash || !hash.startsWith('#')) return null;

                return document.querySelector(hash);
            })
            .filter(Boolean);

        if (!sections.length) return;

        const setActiveLink = (id) => {
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
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.id);
                    }
                });
            },
            {
                root: null,
                rootMargin: '-35% 0px -50% 0px',
                threshold: 0.01
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });
    }

    function initCookieBanner() {
        const banner = document.querySelector(selectors.cookieBanner);
        const acceptButton = document.querySelector(selectors.cookieAccept);
        const declineButton = document.querySelector(selectors.cookieDecline);

        if (!banner) return;

        const storageKey = 'treevoCookieConsent';
        const savedChoice = localStorage.getItem(storageKey);

        if (!savedChoice) {
            banner.classList.add('is-visible');
            banner.setAttribute('aria-hidden', 'false');
        }

        const saveChoice = (choice) => {
            localStorage.setItem(storageKey, choice);
            banner.classList.remove('is-visible');
            banner.setAttribute('aria-hidden', 'true');
        };

        if (acceptButton) {
            acceptButton.addEventListener('click', () => {
                saveChoice('accepted');
            });
        }

        if (declineButton) {
            declineButton.addEventListener('click', () => {
                saveChoice('declined');
            });
        }
    }

    function initAccordions() {
        const buttons = document.querySelectorAll(selectors.accordionButton);

        buttons.forEach((button) => {
            const item = button.closest('[data-accordion-item]');
            const panelId = button.getAttribute('aria-controls');
            const panel = panelId ? document.getElementById(panelId) : item?.querySelector('[data-accordion-panel]');

            if (!item || !panel) return;

            button.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                item.classList.toggle('is-open', !isOpen);
                button.setAttribute('aria-expanded', String(!isOpen));

                if (!isOpen) {
                    panel.removeAttribute('hidden');
                } else {
                    panel.setAttribute('hidden', '');
                }
            });
        });
    }

    function initActivePageLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('[data-page-link]');

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');

            if (!href) return;

            const linkPage = href.split('/').pop();

            if (linkPage === currentPage) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    function initExternalLinkSafety() {
        const links = document.querySelectorAll('a[target="_blank"]');

        links.forEach((link) => {
            const rel = link.getAttribute('rel') || '';

            if (!rel.includes('noopener')) {
                link.setAttribute('rel', `${rel} noopener noreferrer`.trim());
            }
        });
    }

    function initReducedMotionFallback() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            document.documentElement.classList.add('prefers-reduced-motion');
        }
    }

    function init() {
        applyConfigValues();
        initLucideIcons();
        initStickyHeader();
        initMobileMenu();
        initDropdownNavigation();
        initSmoothScroll();
        initWoodTrailActiveState();
        initCookieBanner();
        initAccordions();
        initActivePageLinks();
        initExternalLinkSafety();
        initReducedMotionFallback();
    }

    document.addEventListener('DOMContentLoaded', init);

    window.TREEVO = {
        getConfigValue,
        applyConfigValues,
        scrollToTarget,
        refreshIcons: initLucideIcons
    };
})();
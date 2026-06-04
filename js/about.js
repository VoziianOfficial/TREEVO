'use strict';

(function () {
    function initAboutHeroFallback() {
        const hero = document.querySelector('.about-hero');

        if (!hero) return;

        const image = new Image();

        image.src = 'assets/images/about-hero.jpg';

        image.onerror = () => {
            hero.classList.add('about-hero--missing-image');
        };
    }

    function initMarquee() {
        const track = document.querySelector('[data-marquee-track]');

        if (!track) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            track.style.animation = 'none';
            return;
        }

        const links = track.querySelectorAll('a');

        links.forEach((link) => {
            link.addEventListener('focus', () => {
                track.style.animationPlayState = 'paused';
            });

            link.addEventListener('blur', () => {
                track.style.animationPlayState = 'running';
            });
        });
    }

    function initProblemRows() {
        const rows = document.querySelectorAll('.problem-row');

        rows.forEach((row) => {
            row.addEventListener('mouseenter', () => {
                row.classList.add('is-active');
            });

            row.addEventListener('mouseleave', () => {
                row.classList.remove('is-active');
            });

            row.addEventListener('focus', () => {
                row.classList.add('is-active');
            });

            row.addEventListener('blur', () => {
                row.classList.remove('is-active');
            });
        });
    }

    function initBeforeAfterVisual() {
        const visual = document.querySelector('.before-after__visual');
        const handle = document.querySelector('.before-after__handle');

        if (!visual || !handle) return;

        visual.addEventListener('mouseenter', () => {
            handle.classList.add('is-hovered');
        });

        visual.addEventListener('mouseleave', () => {
            handle.classList.remove('is-hovered');
        });
    }

    function init() {
        initAboutHeroFallback();
        initMarquee();
        initProblemRows();
        initBeforeAfterVisual();

        if (window.TREEVO && typeof window.TREEVO.refreshIcons === 'function') {
            window.TREEVO.refreshIcons();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
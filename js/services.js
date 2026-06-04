'use strict';

(function () {
    function initServicesHeroFallback() {
        const hero = document.querySelector('.services-hero');

        if (!hero) return;

        const image = new Image();

        image.src = 'assets/images/services-hero.jpg';

        image.onerror = () => {
            hero.classList.add('services-hero--missing-image');
        };
    }

    function initServiceCards() {
        const cards = document.querySelectorAll('.service-card-square');

        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('is-hovered');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('is-hovered');
            });

            card.addEventListener('focus', () => {
                card.classList.add('is-hovered');
            });

            card.addEventListener('blur', () => {
                card.classList.remove('is-hovered');
            });
        });
    }

    function init() {
        initServicesHeroFallback();
        initServiceCards();

        if (window.TREEVO && typeof window.TREEVO.refreshIcons === 'function') {
            window.TREEVO.refreshIcons();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();

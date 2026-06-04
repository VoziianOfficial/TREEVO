'use strict';

(function () {
    function initServiceCarousel() {
        const carousels = document.querySelectorAll('[data-service-carousel]');

        carousels.forEach((carousel) => {
            const track = carousel.querySelector('[data-carousel-track]');
            const slides = Array.from(carousel.querySelectorAll('.service-slide'));
            const prevButton = carousel.querySelector('[data-carousel-prev]');
            const nextButton = carousel.querySelector('[data-carousel-next]');
            const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));

            if (!track || !slides.length) return;

            let activeIndex = 0;
            let scrollTimer = null;

            const getSlideStep = () => {
                const firstSlide = slides[0];
                const trackStyles = window.getComputedStyle(track);
                const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || 0);

                return firstSlide.offsetWidth + gap;
            };

            const setActiveSlide = (index) => {
                activeIndex = Math.max(0, Math.min(index, slides.length - 1));

                slides.forEach((slide, slideIndex) => {
                    slide.classList.toggle('is-active', slideIndex === activeIndex);
                });

                dots.forEach((dot, dotIndex) => {
                    dot.classList.toggle('is-active', dotIndex === activeIndex);
                    dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
                });
            };

            const scrollToSlide = (index) => {
                const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
                const targetSlide = slides[safeIndex];

                if (!targetSlide) return;

                track.scrollTo({
                    left: targetSlide.offsetLeft,
                    behavior: 'smooth'
                });

                setActiveSlide(safeIndex);
            };

            const updateActiveFromScroll = () => {
                const trackLeft = track.scrollLeft;
                const step = getSlideStep();

                if (!step) return;

                const index = Math.round(trackLeft / step);
                setActiveSlide(index);
            };

            const goNext = () => {
                const nextIndex = activeIndex >= slides.length - 1 ? 0 : activeIndex + 1;
                scrollToSlide(nextIndex);
            };

            const goPrev = () => {
                const prevIndex = activeIndex <= 0 ? slides.length - 1 : activeIndex - 1;
                scrollToSlide(prevIndex);
            };

            if (nextButton) {
                nextButton.addEventListener('click', goNext);
            }

            if (prevButton) {
                prevButton.addEventListener('click', goPrev);
            }

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    scrollToSlide(index);
                });
            });

            track.addEventListener(
                'scroll',
                () => {
                    window.clearTimeout(scrollTimer);

                    scrollTimer = window.setTimeout(() => {
                        updateActiveFromScroll();
                    }, 80);
                },
                { passive: true }
            );

            track.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    goNext();
                }

                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    goPrev();
                }
            });

            slides.forEach((slide, index) => {
                slide.addEventListener('focus', () => {
                    setActiveSlide(index);
                });

                slide.addEventListener('mouseenter', () => {
                    setActiveSlide(index);
                });
            });

            window.addEventListener(
                'resize',
                () => {
                    scrollToSlide(activeIndex);
                },
                { passive: true }
            );

            setActiveSlide(0);
        });
    }

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
        initServiceCarousel();
        initServicesHeroFallback();
        initServiceCards();

        if (window.TREEVO && typeof window.TREEVO.refreshIcons === 'function') {
            window.TREEVO.refreshIcons();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
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

    function initHomeImageBackgrounds() {
        const imageMap = {
            '.service-slide__image--tree-removal': 'assets/images/tree-removal.jpg',
            '.service-slide__image--emergency': 'assets/images/emergency-tree-removal.jpg',
            '.service-slide__image--trimming': 'assets/images/tree-trimming.jpg',
            '.service-slide__image--stump': 'assets/images/stump-grinding.jpg',
            '.service-slide__image--land': 'assets/images/land-clearing.jpg',
            '.service-slide__image--risk': 'assets/images/tree-risk-assessment.jpg',

            '.property-item__photo--residential': 'assets/images/property-residential.jpg',
            '.property-item__photo--rental': 'assets/images/property-rental.jpg',
            '.property-item__photo--commercial': 'assets/images/property-commercial.jpg',
            '.property-item__photo--hoa': 'assets/images/property-hoa.jpg',
            '.property-item__photo--construction': 'assets/images/property-construction.jpg',
            '.property-item__photo--driveway': 'assets/images/property-driveway.jpg'
        };

        Object.entries(imageMap).forEach(([selector, imagePath]) => {
            document.querySelectorAll(selector).forEach((element) => {
                element.style.backgroundImage = `url("${imagePath}")`;
            });
        });
    }

    function initHeroFallback() {
        const hero = document.querySelector('.home-hero');

        if (!hero) return;

        const image = new Image();

        image.src = 'assets/images/tree-removal-hero.jpg';

        image.onerror = () => {
            hero.classList.add('home-hero--missing-image');
        };
    }

    function init() {
        initHomeImageBackgrounds();
        initServiceCarousel();
        initHeroFallback();

        if (window.TREEVO && typeof window.TREEVO.refreshIcons === 'function') {
            window.TREEVO.refreshIcons();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
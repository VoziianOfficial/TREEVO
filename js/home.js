'use strict';

(function () {
    function initServiceCarousel() {
        const carousels = document.querySelectorAll('[data-service-carousel]');

        carousels.forEach((carousel) => {
            if (carousel.dataset.loopReady === 'true') return;

            const track = carousel.querySelector('[data-carousel-track]');
            const prevButton = carousel.querySelector('[data-carousel-prev]');
            const nextButton = carousel.querySelector('[data-carousel-next]');
            const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));

            if (!track) return;

            const originalSlides = Array.from(track.querySelectorAll('.service-slide'));

            if (!originalSlides.length) return;

            carousel.dataset.loopReady = 'true';

            const slideCount = originalSlides.length;
            let activeIndex = 0;
            let scrollTimer = null;
            let loopTimer = null;
            let isJumping = false;

            originalSlides.forEach((slide, index) => {
                slide.dataset.originalIndex = String(index);
                slide.dataset.slideType = 'original';
            });

            const createClone = (slide, index, type) => {
                const clone = slide.cloneNode(true);

                clone.classList.add('is-clone');
                clone.classList.remove('is-active');
                clone.dataset.originalIndex = String(index);
                clone.dataset.slideType = type;
                clone.setAttribute('aria-hidden', 'true');
                clone.setAttribute('tabindex', '-1');

                return clone;
            };

            const beforeClones = originalSlides.map((slide, index) =>
                createClone(slide, index, 'before-clone')
            );

            const afterClones = originalSlides.map((slide, index) =>
                createClone(slide, index, 'after-clone')
            );

            beforeClones.forEach((clone) => {
                track.insertBefore(clone, originalSlides[0]);
            });

            afterClones.forEach((clone) => {
                track.appendChild(clone);
            });

            const getAllSlides = () => Array.from(track.querySelectorAll('.service-slide'));

            const getTrackPaddingLeft = () => {
                return parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
            };

            const getSlideLeft = (slide) => {
                return slide.offsetLeft - getTrackPaddingLeft();
            };

            const getMiddleSlide = (index) => {
                const allSlides = getAllSlides();

                return allSlides[slideCount + index];
            };

            const scrollToSlideElement = (slide, behavior = 'smooth') => {
                if (!slide) return;

                track.scrollTo({
                    left: getSlideLeft(slide),
                    behavior
                });
            };

            const setActiveSlide = (index) => {
                activeIndex = index;

                getAllSlides().forEach((slide) => {
                    const slideIndex = Number(slide.dataset.originalIndex);

                    slide.classList.toggle('is-active', slideIndex === activeIndex);
                });

                dots.forEach((dot, dotIndex) => {
                    const isActive = dotIndex === activeIndex;

                    dot.classList.toggle('is-active', isActive);

                    if (isActive) {
                        dot.setAttribute('aria-current', 'true');
                    } else {
                        dot.removeAttribute('aria-current');
                    }
                });
            };

            const jumpToMiddleSlide = (index) => {
                const middleSlide = getMiddleSlide(index);

                if (!middleSlide) return;

                isJumping = true;
                scrollToSlideElement(middleSlide, 'auto');

                window.requestAnimationFrame(() => {
                    isJumping = false;
                });
            };

            const getClosestSlide = () => {
                const allSlides = getAllSlides();
                const currentLeft = track.scrollLeft + getTrackPaddingLeft();

                return allSlides.reduce((closest, slide) => {
                    const closestDistance = Math.abs(closest.offsetLeft - currentLeft);
                    const slideDistance = Math.abs(slide.offsetLeft - currentLeft);

                    return slideDistance < closestDistance ? slide : closest;
                }, allSlides[0]);
            };

            const checkLoopPosition = () => {
                if (isJumping) return;

                const closestSlide = getClosestSlide();

                if (!closestSlide) return;

                const closestIndex = Number(closestSlide.dataset.originalIndex);
                const slideType = closestSlide.dataset.slideType;

                if (Number.isNaN(closestIndex)) return;

                setActiveSlide(closestIndex);

                if (slideType === 'before-clone' || slideType === 'after-clone') {
                    jumpToMiddleSlide(closestIndex);
                }
            };

            const goToSlide = (index) => {
                window.clearTimeout(loopTimer);

                const allSlides = getAllSlides();

                if (index > slideCount - 1) {
                    const firstAfterClone = allSlides[slideCount * 2];

                    setActiveSlide(0);
                    scrollToSlideElement(firstAfterClone, 'smooth');

                    loopTimer = window.setTimeout(() => {
                        jumpToMiddleSlide(0);
                    }, 430);

                    return;
                }

                if (index < 0) {
                    const lastBeforeClone = allSlides[slideCount - 1];

                    setActiveSlide(slideCount - 1);
                    scrollToSlideElement(lastBeforeClone, 'smooth');

                    loopTimer = window.setTimeout(() => {
                        jumpToMiddleSlide(slideCount - 1);
                    }, 430);

                    return;
                }

                setActiveSlide(index);
                scrollToSlideElement(getMiddleSlide(index), 'smooth');
            };

            const goNext = () => {
                goToSlide(activeIndex + 1);
            };

            const goPrev = () => {
                goToSlide(activeIndex - 1);
            };

            if (nextButton) {
                nextButton.addEventListener('click', goNext);
            }

            if (prevButton) {
                prevButton.addEventListener('click', goPrev);
            }

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
            });

            track.addEventListener(
                'scroll',
                () => {
                    window.clearTimeout(scrollTimer);

                    scrollTimer = window.setTimeout(() => {
                        checkLoopPosition();
                    }, 120);
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

            getAllSlides().forEach((slide) => {
                slide.addEventListener('mouseenter', () => {
                    const index = Number(slide.dataset.originalIndex);

                    if (!Number.isNaN(index)) {
                        setActiveSlide(index);
                    }
                });

                slide.addEventListener('focus', () => {
                    const index = Number(slide.dataset.originalIndex);

                    if (!Number.isNaN(index)) {
                        setActiveSlide(index);
                    }
                });
            });

            window.addEventListener(
                'resize',
                () => {
                    jumpToMiddleSlide(activeIndex);
                },
                { passive: true }
            );

            window.requestAnimationFrame(() => {
                jumpToMiddleSlide(0);
                setActiveSlide(0);
            });
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
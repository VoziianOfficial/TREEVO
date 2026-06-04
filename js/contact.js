'use strict';

(function () {
    function initContactHeroFallback() {
        const hero = document.querySelector('.contact-hero');

        if (!hero) return;

        const image = new Image();

        image.src = 'assets/images/contact-hero.jpg';

        image.onerror = () => {
            hero.classList.add('contact-hero--missing-image');
        };
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    function setFieldState(field, isValid) {
        if (!field) return;

        field.classList.toggle('is-invalid', !isValid);
    }

    function validateField(input) {
        const field = input.closest('.form-field');

        if (!field) return true;

        let isValid = true;

        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
        }

        if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
            isValid = false;
        }

        if (input.name === 'zip' && input.value.trim() && input.value.trim().length < 4) {
            isValid = false;
        }

        setFieldState(field, isValid);

        return isValid;
    }

    function validateCheckbox(input) {
        const wrapper = input.closest('.custom-check');

        if (!wrapper) return true;

        const isValid = !input.hasAttribute('required') || input.checked;

        wrapper.classList.toggle('is-invalid', !isValid);

        return isValid;
    }

    function showStatus(element, message) {
        if (!element) return;

        element.textContent = message;
        element.classList.add('is-visible');
    }

    function hideStatus(element) {
        if (!element) return;

        element.textContent = '';
        element.classList.remove('is-visible');
    }

    function initContactForm() {
        const form = document.querySelector('[data-contact-form]');

        if (!form) return;

        const inputs = Array.from(
            form.querySelectorAll('input:not([type="checkbox"]), select, textarea')
        );

        const checkboxes = Array.from(form.querySelectorAll('input[type="checkbox"]'));
        const successStatus = form.querySelector('[data-form-success]');
        const errorStatus = form.querySelector('[data-form-error]');

        inputs.forEach((input) => {
            input.addEventListener('blur', () => {
                validateField(input);
            });

            input.addEventListener('input', () => {
                const field = input.closest('.form-field');

                if (field && field.classList.contains('is-invalid')) {
                    validateField(input);
                }

                hideStatus(successStatus);
                hideStatus(errorStatus);
            });
        });

        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                validateCheckbox(checkbox);
                hideStatus(successStatus);
                hideStatus(errorStatus);
            });
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            hideStatus(successStatus);
            hideStatus(errorStatus);

            const fieldsAreValid = inputs
                .filter((input) => input.hasAttribute('required'))
                .every((input) => validateField(input));

            const optionalEmailsAreValid = inputs
                .filter((input) => input.type === 'email' && input.value.trim())
                .every((input) => validateField(input));

            const checksAreValid = checkboxes.every((checkbox) => validateCheckbox(checkbox));

            if (!fieldsAreValid || !optionalEmailsAreValid || !checksAreValid) {
                showStatus(
                    errorStatus,
                    'Please complete the required fields before sending your provider comparison request.'
                );

                const firstInvalid = form.querySelector(
                    '.form-field.is-invalid input, .form-field.is-invalid select, .form-field.is-invalid textarea, .custom-check.is-invalid input'
                );

                if (firstInvalid) {
                    firstInvalid.focus();
                }

                return;
            }

            showStatus(
                successStatus,
                'Thank you. Your tree care provider comparison request has been prepared successfully.'
            );

            form.reset();

            form.querySelectorAll('.form-field.is-invalid').forEach((field) => {
                field.classList.remove('is-invalid');
            });

            form.querySelectorAll('.custom-check.is-invalid').forEach((check) => {
                check.classList.remove('is-invalid');
            });
        });
    }

    function initQuickContactHover() {
        const cards = document.querySelectorAll('.quick-contact__card');

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
        initContactHeroFallback();
        initContactForm();
        initQuickContactHover();

        if (window.TREEVO && typeof window.TREEVO.refreshIcons === 'function') {
            window.TREEVO.refreshIcons();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
/**
 * Crystal Glass Buttons - Interaction Layer
 * Handles ripple effects, click animations, and enhanced interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavScroll();
    initRippleEffects();
    initButtonSounds();
    initMagneticEffect();
    init3DTilt();
    initContactForm();
});

/**
 * Scroll-triggered animations using IntersectionObserver
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .sistema-content, .contact-content');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Navigation background on scroll
 */
function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/**
 * Ripple effect on click for primary buttons
 */
function initRippleEffects() {
    const primaryButtons = document.querySelectorAll('.btn-primary');

    primaryButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = this.querySelector('.btn-ripple');
            const rect = this.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.setProperty('--ripple-x', `${x}px`);
            ripple.style.setProperty('--ripple-y', `${y}px`);

            // Update the ::after pseudo-element position via CSS custom properties
            this.style.setProperty('--click-x', `${x}px`);
            this.style.setProperty('--click-y', `${y}px`);

            // Trigger ripple
            this.classList.remove('rippling');
            void this.offsetWidth; // Force reflow
            this.classList.add('rippling');

            // Clean up
            setTimeout(() => {
                this.classList.remove('rippling');
            }, 600);
        });
    });
}

/**
 * Subtle haptic-like feedback through micro-animations
 */
function initButtonSounds() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mousedown', function () {
            this.style.transition = 'transform 0.1s ease';
        });

        button.addEventListener('mouseup', function () {
            this.style.transition = 'transform 0.5s var(--ease-out-expo)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transition = 'transform 0.5s var(--ease-out-expo)';
        });
    });
}

/**
 * Magnetic hover effect - disabled to prevent layout shift
 */
function initMagneticEffect() {
    // Disabled - was causing buttons to move on hover
}

/**
 * Subtle 3D tilt effect on hover - disabled to prevent layout shift
 */
function init3DTilt() {
    // Disabled - was causing buttons to move on hover
}

/**
 * Glass CTA Button - Dynamic highlight that follows cursor
 */
function initGlassCTAEffects() {
    const glassButtons = document.querySelectorAll('.btn-glass-cta');

    glassButtons.forEach(button => {
        button.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate percentages for gradient position
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;

            // Update CSS custom properties for dynamic highlight
            this.style.setProperty('--mouse-x', `${percentX}%`);
            this.style.setProperty('--mouse-y', `${percentY}%`);

            // Update the inner glass reflection to follow cursor
            this.style.setProperty('--highlight-x', `${percentX}%`);
            this.style.setProperty('--highlight-y', `${percentY}%`);
        });

        button.addEventListener('mouseleave', function () {
            this.style.removeProperty('--mouse-x');
            this.style.removeProperty('--mouse-y');
            this.style.removeProperty('--highlight-x');
            this.style.removeProperty('--highlight-y');
        });
    });
}

// Initialize glass button effects
document.addEventListener('DOMContentLoaded', () => {
    initGlassCTAEffects();
});

/**
 * Add dynamic ripple position via CSS custom property
 */
const style = document.createElement('style');
style.textContent = `
    .btn-primary.rippling .btn-ripple::after {
        left: var(--click-x, 50%);
        top: var(--click-y, 50%);
    }
`;
document.head.appendChild(style);

/**
 * Bonus: Demo loading state on double-click
 */
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('dblclick', function () {
        if (this.classList.contains('loading')) return;

        this.classList.add('loading');

        setTimeout(() => {
            this.classList.remove('loading');
        }, 2000);
    });
});

/**
 * Contact Form Handler
 * Sends form data to Google Apps Script serverless function
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // ⚠️ IMPORTANTE: Reemplazá esta URL con la de tu Google Apps Script deployado
    // Seguí las instrucciones en google-apps-script.js para obtener tu URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz56uSoTtxMzxI_YtXJa7o-9mEZtXPXH15HswJ1LSdCX_ofNQMw3dQegXXXyX9ZeBPCoA/exec';

    const submitBtn = form.querySelector('.btn-submit');
    const messageEl = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Get form data
        const formData = {
            nombre: form.nombre.value.trim(),
            email: form.email.value.trim(),
            empresa: form.empresa.value.trim(),
            servicio: form.servicio.value,
            mensaje: form.mensaje.value.trim(),
            website: form.website ? form.website.value : '' // Honeypot anti-spam
        };

        // Show loading state
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
        hideMessage();

        try {
            // Check if URL is configured
            if (GOOGLE_SCRIPT_URL === 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI') {
                throw new Error('CONFIG_ERROR');
            }

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script requires no-cors
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Since mode is 'no-cors', we can't read the response
            // We assume success if no network error
            showMessage('success', '¡Gracias por contactarnos! Te responderemos pronto.');
            form.reset();

        } catch (error) {
            console.error('Error enviando formulario:', error);

            if (error.message === 'CONFIG_ERROR') {
                showMessage('error', 'El formulario no está configurado. Por favor contactanos por email: contacto@origencore.com');
            } else {
                showMessage('error', 'Hubo un error al enviar el mensaje. Por favor intentá de nuevo o contactanos por email.');
            }
        } finally {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
        }
    });

    function validateForm() {
        let isValid = true;

        // Validate nombre
        if (!form.nombre.value.trim()) {
            showFieldError('nombre', 'Por favor ingresá tu nombre');
            isValid = false;
        }

        // Validate email
        const email = form.email.value.trim();
        if (!email) {
            showFieldError('email', 'Por favor ingresá tu email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Por favor ingresá un email válido');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFieldError(fieldName, message) {
        const group = form.querySelector(`#${fieldName}`).closest('.form-group');
        group.classList.add('has-error');
        const errorEl = group.querySelector('.field-error');
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearErrors() {
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-error');
            const errorEl = group.querySelector('.field-error');
            if (errorEl) {
                errorEl.textContent = '';
            }
        });
    }

    function showMessage(type, text) {
        messageEl.className = `form-message ${type} visible`;
        messageEl.textContent = text;
    }

    function hideMessage() {
        messageEl.className = 'form-message';
        messageEl.textContent = '';
    }
}

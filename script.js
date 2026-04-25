/* ========================================
   KyB SITE - MAIN JAVASCRIPT
   ======================================== */

const CONFIG = {
    whatsappNumber: '5585998370928',
    whatsappMessage: 'Oi Karen, gostaria de saber mais sobre KyB'
};

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeButtons();
    initializeFAQ();
    initializeStaggeredAnimations();
    initializeAccessibility();
    initializeScrollAnimations();
});

/* ========================================
   NAVIGATION & SMOOTH SCROLL
   ======================================== */

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const logo = document.querySelector('.logo');

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    logo.addEventListener('click', () => scrollToSection('home'));
}

function handleNavClick(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    scrollToSection(target.substring(1));
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/* ========================================
   BUTTONS & INTERACTIONS
   ======================================== */

function initializeButtons() {
    const contactButtons = document.querySelectorAll('[data-action="contact"]');
    const scrollButtons = document.querySelectorAll('[data-scroll]');

    contactButtons.forEach(btn => {
        btn.addEventListener('click', handleContactClick);
    });

    scrollButtons.forEach(btn => {
        btn.addEventListener('click', handleScrollClick);
    });
}

function handleContactClick(e) {
    const source = e.target.getAttribute('data-source') || '';
    openWhatsApp(source);
}

function handleScrollClick(e) {
    const sectionId = e.target.getAttribute('data-scroll');
    scrollToSection(sectionId);
}

function openWhatsApp(source) {
    let message = CONFIG.whatsappMessage;

    if (source) {
        message = `${CONFIG.whatsappMessage} ${source}`;
    }

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
}

/* ========================================
   FAQ ACCORDION
   ======================================== */

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFAQ(item));
    });
}

function toggleFAQ(faqItem) {
    const isActive = faqItem.classList.contains('active');

    if (isActive) {
        faqItem.classList.remove('active');
    } else {
        const allItems = document.querySelectorAll('.faq-item');
        allItems.forEach(item => item.classList.remove('active'));
        faqItem.classList.add('active');
    }
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.why-item, .solution-card');
    animatedElements.forEach(el => observer.observe(el));
});

/* ========================================
   STAGGERED ANIMATIONS
   ======================================== */

function initializeStaggeredAnimations() {
    const cardElements = document.querySelectorAll('.solution-card, .why-item, .credentials li');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    cardElements.forEach((el, index) => {
        el.style.animation = `fadeInUp 0.6s ease forwards`;
        el.style.animationDelay = `${index * 0.1}s`;
    });
}

/* ========================================
   ACCESSIBILITY ENHANCEMENTS
   ======================================== */

function initializeAccessibility() {
    addSkipLink();
    enhanceFormAccessibility();
    addAriaLabels();
    manageFocusTrap();
}

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function enhanceFormAccessibility() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (!btn.getAttribute('aria-label') && btn.textContent.trim()) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
}

function addAriaLabels() {
    const expandables = document.querySelectorAll('.faq-item');
    expandables.forEach((item, index) => {
        item.setAttribute('aria-expanded', 'false');
        item.setAttribute('role', 'region');
    });
}

function manageFocusTrap() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeFaq = document.querySelector('.faq-item.active');
            if (activeFaq) {
                toggleFAQ(activeFaq);
            }
        }
    });
}

/* ========================================
   SCROLL-TRIGGERED ANIMATIONS
   ======================================== */

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = index * 0.05;
                entry.target.style.animation = `fadeInUp 0.6s ease forwards ${delay}s`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.why-item, .solution-card, .credentials li').forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   MOTION PREFERENCES
   ======================================== */

function respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--transition-normal', '0ms ease');
        document.documentElement.style.setProperty('--transition-fast', '0ms ease');
        document.documentElement.style.setProperty('--transition-slow', '0ms ease');
    }
}
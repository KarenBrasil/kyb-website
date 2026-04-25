const CONFIG = {
    whatsappNumber: '5585998370928',
    whatsappMessage: 'Oi Karen, gostaria de saber mais sobre KyB'
};

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeButtons();
    initializeFAQ();
    initializeTheme();
});

/* NAVIGATION */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const logo = document.querySelector('.logo');

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    logo?.addEventListener('click', () => scrollToSection('home'));
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

/* BUTTONS */
function initializeButtons() {
    const contactButtons = document.querySelectorAll('[data-action="contact"]');

    contactButtons.forEach(btn => {
        btn.addEventListener('click', handleContactClick);
    });
}

function handleContactClick(e) {
    const source = e.target.getAttribute('data-source') || '';
    openWhatsApp(source);
}

function openWhatsApp(source) {
    let message = CONFIG.whatsappMessage;

    if (source) {
        message = `${CONFIG.whatsappMessage} - ${source}`;
    }

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
}

/* FAQ */
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

/* DARK MODE */
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}
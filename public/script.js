// ===== LOADER TIMING =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 2200);
});

// ===== SCROLL REVEAL SYSTEM =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.style.animation || 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ===== MARQUEE DUPLICATE (para loop infinito) =====
function setupMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const clone = marqueeContent.cloneNode(true);
        marqueeContent.parentElement.appendChild(clone);
    }
}

setupMarquee();

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Fecha outros itens
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Abre/fecha o item atual
        item.classList.toggle('active');
    });
});

// ===== SMOOTH SCROLL PARA LINKS ÂNCORA =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===== LANGUAGE SELECTOR (Estrutura básica) =====
const langBtns = document.querySelectorAll('.lang-btn');

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const lang = btn.getAttribute('data-lang');
        localStorage.setItem('language', lang);
        // Aqui entraria a lógica de tradução
        console.log('Language changed to:', lang);
    });
});

// ===== SLIDESHOW HERO =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
}

setInterval(nextSlide, 5000);

// ===== SCROLL INDICATOR (remove ao scroll) =====
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator && window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else if (scrollIndicator) {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
    }
});

// ===== WHATSAPP NUMBER FORMATTER =====
function formatWhatsAppLink(number) {
    // Remove caracteres não numéricos
    const clean = number.replace(/\D/g, '');
    // Retorna URL do WhatsApp
    return `https://wa.me/${clean}`;
}

// ===== LAZY LOAD IMAGES (Se necessário no futuro) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header && window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    } else if (header) {
        header.style.background = 'rgba(255, 255, 255, 0.9)';
    }
});

// ===== PREVENT MULTIPLE CLICK ON CTA =====
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    let clicked = false;

    link.addEventListener('click', () => {
        if (!clicked) {
            clicked = true;
            setTimeout(() => {
                clicked = false;
            }, 1000);
        }
    });
});

// ===== MOBILE MENU HANDLER (Se necessário adicionar menu burger) =====
// Função pronta para expansão futura

console.log('KyB Website Loaded Successfully ✅');

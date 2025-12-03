/* =========================================
    GLOBAL - Se ejecuta en TODAS las páginas
========================================= */

// Smooth scrolling para enlaces internos (#)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Navbar transparente → solida al hacer scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(88, 121, 151, 0.95)';
    } else {
        navbar.style.backgroundColor = 'var(--primary-color)';
    }
});

// Botón "Back to top"
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-back-to-top");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        btn.classList.toggle("show", window.scrollY > 200);
    });

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});


/* =========================================
    HOME PAGE (index.html)
    Solo corre si existe el formulario
========================================= */

// Formulario de contacto (solo en INICIO)
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias por su consulta! Nos pondremos en contacto a la brevedad.');
        this.reset();
    });
}


/* =========================================
    ABOUT y SERVICES - Animaciones
    (solo si existen cards)
========================================= */

const animatedElements = document.querySelectorAll('.lawyer-card, .service-card');

if (animatedElements.length > 0) {

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Inicializamos estilos iniciales
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}



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
    TOAST SYSTEM (front-end puro)
========================================= */

function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast " + (type === "error" ? "error" : "");
    toast.innerText = message;

    container.appendChild(toast);

    // Entrada
    setTimeout(() => toast.classList.add("show"), 10);

    // Salida y eliminación
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


/* =========================================
    VALIDACIONES
========================================= */

function validateName(name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 && name.length >= 4;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateJurisdiction(j) {
    return j === "caba" || j === "pba";
}

function validateArea(area) {
    const valid = ["dont_know", "derecho_familia", "contratos", "sucesiones", "derecho_penal", "derechos_reales", "derecho_consumidor"];
    return valid.includes(area);
}

function validateMessage(msg) {
    return msg.trim().length >= 10;
}


/* =========================================
    FORMULARIO DE CONTACTO
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const jurisdiction = form.jurisdiction.value.trim();
        const area = form.area.value.trim();
        const message = form.message.value.trim();

        // VALIDACIONES
        if (!validateName(name)) {
            showToast("Ingresá tu nombre completo.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showToast("Ingresá un email válido.", "error");
            return;
        }

        if (!validateJurisdiction(jurisdiction)) {
            showToast("Seleccioná una jurisdicción válida.", "error");
            return;
        }

        if (!validateArea(area)) {
            showToast("Seleccioná un área válida.", "error");
            return;
        }

        if (!validateMessage(message)) {
            showToast("El mensaje debe tener mínimo 10 caracteres.", "error");
            return;
        }

        // Enviar datos
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, jurisdiction, area, message })
            });

            const json = await res.json();

            if (res.ok) {
                showToast("Consulta enviada. ¡Gracias por contactarnos!");
                form.reset();
            } else {
                console.error(json);
                showToast("Error al enviar la consulta.", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "error");
        }
    });
});


/* =========================================
    Animaciones
========================================= */

const animatedElements = document.querySelectorAll('.reveal');

if (animatedElements.length > 0) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

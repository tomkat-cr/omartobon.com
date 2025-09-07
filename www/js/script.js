const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// const phpScriptPrefix = isLocalhost ? 'www/' : '';
const phpScriptPrefix = '';

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', function() {

    // Smooth scrolling para los enlaces del menú
    document.querySelectorAll('nav-menu ul li a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Obtener la altura del header para ajustar el scroll
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // -20px para un poco de espacio extra

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Lógica del Formulario de Contacto ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.action = `${phpScriptPrefix}php/contact.php`;
    }

    // --- Lógica para animaciones o efectos adicionales (opcional) ---
    // Por ejemplo, un efecto de fade-in para secciones al hacer scroll
    const sections = document.querySelectorAll('.section-card, .contact-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Dejar de observar una vez que se muestra
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in-hidden'); // Ocultar inicialmente con CSS
        sectionObserver.observe(section);
    });

    // Necesitas añadir este CSS en style.css para el efecto fade-in
    /*
    .fade-in-hidden {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    */
});
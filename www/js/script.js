const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const phpScriptPrefix = isLocalhost ? 'www/' : '';

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

    // // --- Lógica para la Galería de Imágenes (Imágenes con IA) ---
    // // Esta es una implementación básica de lightbox. Puedes usar librerías más robustas si lo deseas.
    // const imagenIaSection = document.getElementById('imagenes-ia');
    // if (imagenIaSection) {
    //     // En una implementación real, aquí cargarías las imágenes dinámicamente o tendrías la galería HTML.
    //     // Por ahora, simularemos un clic en una imagen dentro de la sección.

    //     // Ejemplo: Si tuvieras un botón "Ver Galería" en la card de imágenes-ia
    //     const verGaleriaBtn = imagenIaSection.querySelector('.btn');
    //     if (verGaleriaBtn) {
    //         verGaleriaBtn.addEventListener('click', function(e) {
    //             e.preventDefault();
    //             // Aquí podrías cargar un modal o redirigir a una página de galería
    //             alert('Aquí se abriría la galería de imágenes con IA a pantalla completa.');
    //             // Idealmente, cargarías dinámicamente las imágenes o usarías un script de galería.
    //         });
    //     }
    // }


    // // --- Lógica para la Galería de Avatares Animados (Videos) ---
    // const avataresSection = document.getElementById('avatares-animados');
    // if (avataresSection) {
    //     // Similar a las imágenes, aquí se manejaría la lógica de abrir videos a pantalla completa.
    //     const verAvataresBtn = avataresSection.querySelector('.btn');
    //     if (verAvataresBtn) {
    //         verAvataresBtn.addEventListener('click', function(e) {
    //             e.preventDefault();
    //             alert('Aquí se abriría la galería de avatares animados con videos a pantalla completa y controles.');
    //             // Aquí la lógica para un lightbox de video.
    //         });
    //     }
    // }

    // --- Lógica del Formulario de Contacto ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.action = `${phpScriptPrefix}php/contact.php`;
    }
    // const contactForm = document.querySelector('.contact-form');
    // if (contactForm) {
    //     contactForm.addEventListener('submit', function(e) {
    //         e.preventDefault(); // Evitar el envío estándar del formulario

    //         // Validación básica del formulario (puedes añadir más si es necesario)
    //         const name = document.getElementById('name').value.trim();
    //         const email = document.getElementById('email').value.trim();
    //         const message = document.getElementById('message').value.trim();

    //         if (name === '' || email === '' || message === '') {
    //             alert('Por favor, completa todos los campos del formulario.');
    //             return; // Detener el envío si hay campos vacíos
    //         }

    //         // Validación básica de email
    //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //         if (!emailRegex.test(email)) {
    //             alert('Por favor, introduce un correo electrónico válido.');
    //             return;
    //         }

    //         // Si la validación es exitosa, se procede con el envío vía Fetch API (AJAX)
    //         // Esto enviará los datos a tu script PHP sin recargar la página.
    //         fetch(`${phpScriptPrefix}php/contact.php`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             body: new URLSearchParams(new FormData(contactForm)).toString() // Serializa los datos del formulario
    //         })
    //         .then(response => response.text()) // Recibe la respuesta del servidor como texto
    //         .then(data => {
    //             // Aquí puedes mostrar un mensaje de éxito o error al usuario

    //             // alert(data); // El PHP responderá con un mensaje
    //             console.log('contact.php RESPONSE | data', data);

    //             if (data.includes('éxito')) { // Si la respuesta de PHP indica éxito
    //                 contactForm.reset(); // Limpiar el formulario
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error al enviar el formulario:', error);
    //             // alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
    //         });
    //     });
    // }

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
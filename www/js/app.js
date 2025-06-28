const ga = import('./galleries.js');

document.addEventListener('DOMContentLoaded', () => {
    const contentPlaceholder = document.getElementById('content-placeholder');

    const routes = {
        '': 'home.html',
        'customer-success': 'customer-success.html',
        'imagenes-ia': 'imagenes-ia.html',
        'avatares-animados': 'avatares-animados.html',
        'presentaciones': 'presentaciones.html',
        'prompts-estrategicos': 'prompts-estrategicos.html'
    };

    const galleries = {
        'avatares-animados': 'data/ai_avatars.json',
        'presentaciones': 'data/presentations.json',
        'imagenes-ia': 'data/ai_image_generation.json'
    };

    const appendGallery = (path) => {
        if (!galleries[path]) {
            console.warn('Gallery not found for path:', path);
            return;
        }
        const galleryContainer = document.getElementById('gallery-container');
        if (!galleryContainer) {
            console.error('Element with ID "gallery-container" not found.');
            return;
        }
        ga.then((jsCode) => {
            jsCode.createGallery({
                jsonFilePath: galleries[path],
                // galleryElementId: 'gallery-container',
                // folderColumns: 4,
                // folderRows: 10,
                // folderMargin: '10px',
                // thumbnailColumns: 4,
                // thumbnailRows: 10,
                // thumbnailMargin: '10px',
                // thumbnailSize: '100px'
            });
        });
    };

    const loadContent = async (path) => {
        // Determine which file to load, defaulting to home.html
        const pageFile = routes[path] || routes[''];

        try {
            const response = await fetch(pageFile);
            if (!response.ok) throw new Error('Page not found');
            
            const html = await response.text();
            contentPlaceholder.innerHTML = html;
            // Move to the top
            window.scrollTo(0, 0);
            // Append gallery
            appendGallery(path);
        } catch (error) {
            console.error('Error loading page:', error);
            contentPlaceholder.innerHTML = '<h2>Error</h2><p>No se pudo cargar el contenido. Por favor, intente de nuevo.</p>';
        }
    };

    const router = () => {
        const path = window.location.hash.substring(1);
        loadContent(path);
    };

    // Load content on initial page load
    router();

    // Listen for hash changes
    window.addEventListener('hashchange', router);

    // Responsive Navigation
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
});

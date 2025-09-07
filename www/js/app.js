const ga = import('./galleries.js');
let debug = false;

document.addEventListener('DOMContentLoaded', () => {
    const contentPlaceholder = document.getElementById('content-placeholder');

    const routes = {
        '': 'home.html',
        'customer-success': 'customer-success.html',
        'imagenes-ia': 'imagenes-ia.html',
        'avatares-animados': 'avatares-animados.html',
        'presentaciones': 'presentaciones.html',
        'prompts-estrategicos': 'prompts-estrategicos.html',
        'contacto': '#contacto'
    };

    const galleries = {
        'avatares-animados': 'data/ai_avatars.json',
        'presentaciones': 'data/presentations.json',
        'imagenes-ia': 'data/ai_image_generation.json'
    };

    const appendGallery = (path) => {
        if (!galleries[path]) {
            if (debug) console.warn('Gallery not found for path:', path);
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
            });
        });
    };

    const loadContent = async (path) => {
        // Determine which file to load, defaulting to home.html
        const pageFile = routes[path] || routes[''];

        if (pageFile.startsWith('#')) {
            const section = document.querySelector(pageFile);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
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


    const urlSplitter = (url) => {
        const href = url ?? window.location.href;
        const uri = href && href.indexOf('?') !== -1 ? href.substring(0, href.indexOf('?')) : href;
        const host = uri && uri.indexOf('#') !== -1 ? uri.substring(0, uri.indexOf('#')) : uri;
        const path = uri && uri.indexOf('#') !== -1 ? uri.substring(uri.indexOf('#')+1) : uri;
        const queryParams = href && href.indexOf('?') !== -1 ? href.substring(href.indexOf('?') + 1) : '';
        const params = queryParams.split('&').reduce((acc, param) => {
            const [key, value] = param.split('=');
            acc[key] = value;
            return acc;
        }, {});
        return {
            'uri': uri,
            'host': host,
            'path': path,
            'params': params
        };
    }

    const router = () => {
        const { uri, host, path, params } = urlSplitter(window.location.href);
        const status = params['status'];
        debug = params['dbg'];
        if (debug) {
            console.log('>> Status:', status, '\nHREF:', window.location.href, '\nparams', params, '\nuri', uri, '\nhost', host, '\npath', path);
        }
        if (status) {
            showStatus(status);
        }
        loadContent(path);
    };

    const showStatus = (status) => {
        const statusContainer = document.getElementById('status-container');
        if (statusContainer) {
            statusContainer.innerHTML = decodeURIComponent(status);
            if (status.toLowerCase().includes('error')) {
                statusContainer.classList.add('error');
            } else {
                statusContainer.classList.add('success');
            }
            statusContainer.classList.add('show');
            setTimeout(() => {
                statusContainer.classList.remove('show');
                // Remove the status parameter from the URL
                const { uri, host, path, params } = urlSplitter(window.location.href);
                window.history.replaceState(null, '', host + "#" + path);
            }, 5000);
        }
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

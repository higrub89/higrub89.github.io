document.addEventListener("DOMContentLoaded", function() {
    const lang = document.documentElement.lang || 'es';
    const pathPrefix = document.body.dataset.pathPrefix || '.';

    const loadComponent = (componentName, targetElement) => {
        const componentUrl = `${pathPrefix}/templates/${componentName}-${lang}.html`;
        fetch(componentUrl)
            .then(response => response.ok ? response.text() : Promise.reject(`File not found: ${componentUrl}`))
            .then(data => {
                document.querySelector(targetElement).innerHTML = data;
                // It's crucial to update relative paths before trying to evaluate them
                updateLinks(targetElement, pathPrefix);
                
                if (componentName === 'header') {
                    updateActiveNav();
                    updateLanguageSwitcher();
                }
            })
            .catch(error => {
                console.error(`Error loading component ${componentName}:`, error);
                document.querySelector(targetElement).innerHTML = `<p style="color: red;">Error al cargar ${componentName}.</p>`;
            });
    };

    const updateLinks = (parentElement, prefix) => {
        if (prefix === '.') return; // No need to update if in root directory
        document.querySelectorAll(`${parentElement} a`).forEach(link => {
            let href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto')) {
                link.setAttribute('href', `${prefix}/${href}`);
            }
        });
    };

    const updateActiveNav = () => {
        const currentUrl = window.location.href.split('#')[0];
        document.querySelectorAll('header nav a').forEach(link => {
            if (link.href === currentUrl) {
                link.classList.add('active');
            }
        });
    };

    const updateLanguageSwitcher = () => {
        const currentFile = window.location.pathname.split('/').pop();
        let esPage, enPage;

        if (currentFile.includes('-en')) {
            enPage = currentFile;
            esPage = currentFile.replace('-en.html', '.html');
        } else {
            esPage = currentFile;
            enPage = currentFile.replace('.html', '-en.html');
        }

        // Handle root case where currentFile might be empty
        if (esPage === '' || esPage === 'index.html') {
            esPage = 'index.html';
            enPage = 'index-en.html';
        }

        const switcher = document.querySelector('.language-switcher');
        if (!switcher) return;

        const esLink = switcher.querySelector('a:first-of-type');
        const enLink = switcher.querySelector('a:last-of-type');

        if(esLink) esLink.href = esPage;
        if(enLink) enLink.href = enPage;

        // Set active class based on page language
        if (lang === 'es') {
            if(esLink) esLink.classList.add('active');
            if(enLink) enLink.classList.remove('active');
        } else {
            if(enLink) enLink.classList.add('active');
            if(esLink) esLink.classList.remove('active');
        }
    };

    // Scroll Animation Observer
    const initScrollAnimations = () => {
        const fadeElements = document.querySelectorAll('.fade-in-section');
        
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optionally unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => observer.observe(element));
    };

    loadComponent('header', 'header');
    loadComponent('footer', 'footer');
    
    // Initialize scroll animations
    initScrollAnimations();
});

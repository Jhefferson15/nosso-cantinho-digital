import { loadPage, onNavigate } from './router/router.js';
import { registerServiceWorker } from './services/sw-register.js';

document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('[data-link]');
        if (link) {
            e.preventDefault();
            onNavigate(link.getAttribute('href'));
        }
    });

    // Carrega a página com base no hash inicial
    loadPage();
});
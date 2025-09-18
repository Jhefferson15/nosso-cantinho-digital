import { routes } from './routes.js';

const loadPage = async () => {
    const contentDiv = document.getElementById('app');
    if (!contentDiv) {
        console.error("Div com id 'app' não encontrada.");
        return;
    }

    // Obtém o path do hash ou define como a rota raiz se estiver vazio
    const path = window.location.hash || '#/';

    // Encontra a rota correspondente
    const route = routes[path] || routes['404'];
    const html = await fetch(route.template).then((data) => data.text());
    contentDiv.innerHTML = html;

    // Se a rota tem uma função de inicialização, execute-a
    if (route.init) {
        route.init();
    }
};

const onNavigate = (pathname) => {
    window.location.hash = pathname;
};

window.addEventListener('hashchange', loadPage);

export { loadPage, onNavigate };

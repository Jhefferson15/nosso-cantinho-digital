const BUJO_STORAGE_KEY = 'nossoBujo';

const initialData = {
    user: { name: 'Beatriz' },
    collections: {
        'Livros para Ler': ['O Senhor dos Anéis', 'Duna', '1984'],
        'Filmes para Assistir': ['Pulp Fiction', 'A Origem', 'Interestelar'],
        'Ideias para Projetos': ['Criar um portfólio', 'Aprender uma nova linguagem de programação'],
        'Lugares para Visitar': ['Japão', 'Itália', 'Nova Zelândia']
    },
    monthlyLogs: {},
    habits: {},
    finances: {},
    futureLog: {},
};

export const getData = () => {
    const data = localStorage.getItem(BUJO_STORAGE_KEY);
    if (!data) {
        saveData(initialData);
        return initialData;
    }
    return JSON.parse(data);
};

export const saveData = (data) => {
    localStorage.setItem(BUJO_STORAGE_KEY, JSON.stringify(data));
};

const initDashboardView = () => {
    const data = getData();
    const welcomeEl = document.getElementById('bujo-welcome-message');
    if (welcomeEl) {
        welcomeEl.textContent = `Bem-vinda de volta, ${data.user.name}!`;
    }
};

const loadViewCss = (view) => {
    const oldLink = document.getElementById('bujo-module-css');
    if (oldLink) {
        oldLink.remove();
    }

    const cssPath = `./src/css/bujo/${view}.css`;
    const link = document.createElement('link');
    link.id = 'bujo-module-css';
    link.rel = 'stylesheet';
    link.href = cssPath;
    
    fetch(cssPath)
        .then(res => {
            if (res.ok) {
                document.head.appendChild(link);
            }
        });
};

const renderView = async (view) => {
    const content = document.getElementById('bujo-content');
    if (!content) {
        console.error("Bujo content container not found!");
        return;
    }

    try {
        const response = await fetch(`./src/pages/bujo/${view}.html`);
        if (!response.ok) {
            content.innerHTML = `<div class="bujo-card"><p>Seção não encontrada.</p></div>`;
            return;
        }
        const html = await response.text();
        content.innerHTML = html;

        const oldLink = document.getElementById('bujo-module-css');
        if (oldLink) {
            oldLink.remove();
        }

        if (view === 'dashboard') {
            initDashboardView();
            return;
        }

        loadViewCss(view);
        const module = await import(`../bujo/${view}.js`);
        if (module.default && typeof module.default === 'function') {
            module.default();
        }
    } catch (error) {
        console.error(`Error rendering view ${view}:`, error);
        content.innerHTML = `<div class="bujo-card"><p>Ocorreu um erro ao carregar esta seção.</p></div>`;
    }
};

export function initJournal() {
    const nav = document.getElementById('bujo-nav');
    if (!nav) return;

    nav.addEventListener('click', (e) => {
        e.preventDefault();
        const link = e.target.closest('.bujo-nav-link');
        if (!link) return;

        nav.querySelectorAll('.bujo-nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const view = link.dataset.view;
        if (view) {
            renderView(view);
        }
    });

    renderView('dashboard');
}
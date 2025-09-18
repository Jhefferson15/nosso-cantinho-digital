import { initMomentsPage } from '../moments/moments.js';
import { initLightbox } from '../components/gallery.js';
import { initPlansPage } from '../components/plans.js';
import { initJournal } from '../components/journal.js';
import { initCustomAudioPlayers } from '../components/audio.js';
import { initIntegrations } from '../components/integrations.js';

const routes = {
    '#/': { template: './src/pages/home.html', title: 'Home', init: null },
    '#/momentos': { template: './src/pages/momentos.html', title: 'Momentos', init: initMomentsPage },
    '#/galeria': { template: './src/pages/galeria.html', title: 'Galeria', init: initLightbox },
    '#/planos': { template: './src/pages/plans.html', title: 'Nossos Planos', init: initPlansPage },
    '#/journal': { template: './src/pages/journal.html', title: 'Nosso Diário', init: initJournal },
    '#/audios': { template: './src/pages/audios.html', title: 'Nossos Áudios', init: initCustomAudioPlayers },
    '#/integrations': { template: './src/pages/integrations.html', title: 'Integrações', init: initIntegrations },
    '404': { template: './src/pages/404.html', title: 'Página não encontrada', init: null },
};

export { routes };
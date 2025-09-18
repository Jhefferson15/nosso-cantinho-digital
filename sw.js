const CACHE_NAME = 'nosso-cantinho-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/css/base/global.css',
  '/src/css/main.css',
  '/src/js/app.js',
  '/src/js/router/router.js',
  '/src/js/router/routes.js',
  // Componentes JS
  '/src/js/components/swipe.js',
  '/src/js/components/gallery.js',
  '/src/js/components/plans.js',
  '/src/js/components/journal.js',
  '/src/js/components/audio.js',
  // Páginas HTML principais
  '/src/pages/home.html',
  '/src/pages/momentos.html',
  '/src/pages/galeria.html',
  '/src/pages/plans.html',
  '/src/pages/journal.html',
  '/src/pages/audios.html',
  '/src/pages/404.html',
  // Páginas do Bujo
  '/src/pages/bujo/dashboard.html',
  '/src/pages/bujo/log.html',
  '/src/pages/bujo/collections.html',
  '/src/pages/bujo/habits.html',
  '/src/pages/bujo/finances.html',
  '/src/pages/bujo/graph.html',
  // Ícones e fontes
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estratégia de Cache-First
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o recurso estiver no cache, retorna ele
        if (response) {
          return response;
        }
        // Se não, busca na rede, clona, e armazena no cache para uso futuro
        return fetch(event.request).then(
          response => {
            // Verifica se recebemos uma resposta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta. A resposta é um stream e só pode ser consumida uma vez.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
            // Em caso de falha de rede (offline), pode-se retornar uma página de fallback
            // Para este caso, apenas falhamos, mas o erro é capturado.
            console.error('Fetch failed; returning offline fallback if available.');
        });
      })
  );
});

// Service Worker para GitHub Pages (subcarpeta) - Estrategia Cache First
const VERSION = 'v2-' +  (self.registration ? (self.registration.scope || '') : '');
const CACHE_NAME = 'loteria-cache-' + VERSION;
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",
  "./apple-touch-icon.png",
  "./apple-touch-icon-precomposed.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "images/aguila.png",
  "images/alacran.png",
  "images/apache.png",
  "images/arana.png",
  "images/arbol.png",
  "images/aretes.png",
  "images/arpa.png",
  "images/auto.png",
  "images/avion.png",
  "images/bailarinas.png",
  "images/bandera.png",
  "images/bandolon.png",
  "images/barril.png",
  "images/borracho.png",
  "images/bota.png",
  "images/botella.png",
  "images/boxeadores.png",
  "images/bruja.png",
  "images/cacahuates.png",
  "images/cafetera.png",
  "images/calavera.png",
  "images/camaron.png",
  "images/camion.png",
  "images/campana.png",
  "images/cantarito.png",
  "images/carretilla.png",
  "images/catrin.png",
  "images/cazo.png",
  "images/cebolla.png",
  "images/cerezas.png",
  "images/chalupa.png",
  "images/cisnes.png",
  "images/clavel.png",
  "images/cocinero.png",
  "images/corazon.png",
  "images/corona.png",
  "images/cotorro.png",
  "images/dama.png",
  "images/diablito.png",
  "images/domino.png",
  "images/elefante.png",
  "images/elote.png",
  "images/escalera.png",
  "images/escoba.png",
  "images/escopeta.png",
  "images/escuela.png",
  "images/estrella.png",
  "images/ferrocarril.png",
  "images/fonografo.png",
  "images/futbolistas.png",
  "images/gallo.png",
  "images/garza.png",
  "images/golondrina.png",
  "images/gorrito.png",
  "images/guajolote.png",
  "images/herradura.png",
  "images/jarabe.png",
  "images/jaras.png",
  "images/jicara.png",
  "images/jorobado.png",
  "images/lagarto.png",
  "images/llanta.png",
  "images/luna.png",
  "images/maceta.png",
  "images/mandarin.png",
  "images/mano.png",
  "images/marimba.png",
  "images/martillo.png",
  "images/melon.png",
  "images/motocicleta.png",
  "images/muerte.png",
  "images/mundo.png",
  "images/muneca.png",
  "images/musico.png",
  "images/negrito.png",
  "images/nopal.png",
  "images/organo.png",
  "images/oso.png",
  "images/pajarito.png",
  "images/palma.png",
  "images/paloma.png",
  "images/paracaidas.png",
  "images/paraguas.png",
  "images/payaso.png",
  "images/pera.png",
  "images/pescado.png",
  "images/pinata.png",
  "images/pino.png",
  "images/pintor.png",
  "images/plancha.png",
  "images/platanos.png",
  "images/puro.png",
  "images/radio.png",
  "images/rana.png",
  "images/regadera.png",
  "images/rosa.png",
  "images/sandia.png",
  "images/sarape.png",
  "images/sirena.png",
  "images/sol.png",
  "images/soldado.png",
  "images/tambor.png",
  "images/telefono.png",
  "images/tigre.png",
  "images/tlachiquero.png",
  "images/valiente.png",
  "images/venado.png",
  "images/violoncello.png"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('pwa-cache-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const req = event.request;
  const url = new URL(req.url);

  // Solo manejar mismo origen (GitHub Pages del proyecto)
  if (url.origin !== self.location.origin) return;

  // Navegaciones: devolver index del caché (SPA) y caer a offline.html si falla
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => {
        return cached || fetch(req).catch(() => caches.match('./offline.html'));
      })
    );
    return;
  }

  // Assets: Cache First, luego red; si red responde, se actualiza caché en segundo plano
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return resp;
      }).catch(() => {
        // Si es imagen y no hay red ni caché, podrías devolver un placeholder
        if (req.destination === 'image') return new Response('', { status: 404 });
        return caches.match('./offline.html');
      });
    })
  );
});
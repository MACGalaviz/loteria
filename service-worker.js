const CACHE_NAME = "loteria-cache-v1";
const URLS_TO_CACHE = [
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

// Instalación y cacheo inicial
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("📥 Archivos cacheados");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activación y limpieza de cachés viejas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Estrategia Cache First
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});

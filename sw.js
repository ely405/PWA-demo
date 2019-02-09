// Preparamos la activación de service worker
const CACHE_DEMO_PWA = 'demo-pwa-v1';

const urlsToCache = [
  '/', //por el servidor
  './', //por la raiz de la carpeta
  './?utm=homescreen', //por la pantalla de inicio
  './index.html',
  './index.html?utm=homescreen',
  './style.css',
  './index.js',
  './sw.js',
  './favicon.ico', //también podemos guardar todos los archivos png
  // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
]

// self -> invocamos a si mismo (service worker)
self.addEventListener('install', e => {
  console.log('SW instalado');
  //empezamos a registrar cache
  //waitUntil -> permite tener interacción con el cache
  e.waitUntil(
    //si no existe lo crea para luego abrirlo
    caches.open(CACHE_DEMO_PWA)
    .then(cache => {
      console.log('Archivo en cache');
      console.log('url para el cache', urlsToCache);
      //addAll -> agrega todas las urls al cache
      return cache.addAll(urlsToCache).then(() => self.skipWaiting());
      //skipwaiting -> forza a activarse al servie worker
    })
    .catch(err => console.log('Error al abrir y registrar cache', err))
  );
});

//junto con el evento install es importante activarlo
self.addEventListener('activate', e => {
  console.log('SW activado', e);
  //para cuando el cache detecte que un archivo ha cambiado de un acceso a otro
  const cacheList = [CACHE_DEMO_PWA];

  console.log('caches...', caches);
  e.waitUntil(
    caches.keys()
    .then(cachesNames => {
      return Promise.all(cachesNames.map(cacheName => {
        if (cacheList.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      }));
    }).then(() => {
      console.log('El cache esta limpio y actulizado');
      //claim -> service worker activa los elementos actuales y que este a la epera de posibles cambios
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('SW recuperado(fetch)');
  //respondWith -> perimite observar el cache al service worker
  e.respondWith(
    //match -> busca coincidencias
    caches.match(e.request).then(res => {
      if (res) {
        return res;
      }

      // return fetch( e.request ).then(response => {
      //   console.log('REQUEST', e.request);
      //   console.log('RESPONSE', response);
      //   let responseToCache = response.clone();

      //   caches.open(cacheName).then(cache => {
      //     //put -> indicamos que vuelva a poner los datos recuperados al cache
      //     cache.put(request, responseToCache)
      //       .catch(err => console.log('Error al poner al cache', `${request.url}: ${err.message}`));
      //   });

      //   return response;
      // });

      return fetch(e.request);
    })
  );
});

self.addEventListener('push', e => {
  console.log('evento push');
  let notificationTitle = 'Notificación de prueba',
    notificactionOptions = {
      body: 'Click para regresar a la app',
      icon: './img/icon_16x16.png',
      vibrate: [100, 50, 100], //manda tres vibraciones al dispositivo
      /*aqui se mandan n cantidad de datos que se necesiten pasar
        a la aplicación a través de la notificación*/
      data: {
        id: 1
      },
      /* podemos mandar dos opciones en las acciones */
      actions: [{
          action: 'Si',
          title: 'Me encanta esta aplicación',
          icon: './img/icon_192x192.png'
        },
        {
          action: 'No',
          title: 'No me gusta esta aplicación',
          icon: './img/icon_192x192.png'
        },
      ]
    };

  //Mandamos en el evento push
  e.waitUntil(self.registration.showNotification(notificationTitle, notificactionOptions));
});

self.addEventListener('notificationclick', e => {
  console.log(e);
  if (e.action === 'Si') {
    console.log('Me encanta esta app');
    //abre una página después del click
    clients.openWindow('https://laboratoria.la');
  } else if (e.action === 'No') {
    console.log('No me gusta esta app');
  }

  //después del click se cierra
  e.notification.close();
});

// promise
// ( c => {
//   const cuadrado = value => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(value*value)
//       }, Math.random() * 100);
//     });
//   }

//   cuadrado(2)
//     .then( result => {
//       c('inicia promise');
//       c(`promise ${result}`);
//       return cuadrado(4);
//     }).then( result => {
//       c(`promise ${result}`);
//     })
//     .catch(err => c(err))
//   })(console.log);

;
//Registro y características de pwa
((d, w, n, c) => {
  //registro d service worker
  if ( 'serviceWorker' in n ) {
    w.addEventListener('load', () => {
      n.serviceWorker.register('./sw.js')
        .then( registration => {
          c('service worker en el scope', registration.scope);
        })
        .catch(err => c('Registro de service worker ha fallado', err));
    });
  }
  //activando el permiso de notificaciones
  if( w.Notification && Notification.permission !== 'denied' ){
    Notification.requestPermission(status => {
      c('status de notificacion', status);
      let noti = new Notification('Aqui el Título', {
        body: 'Hola! soy una notificación :D',
        icon: './img/icon_192x192.png'
      });
    });
  }

})(document, window, navigator, console.log);

// if ( 'serviceWorker' in navigator ) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('./sw.js')
//       .then( registration => {
//         // console.log('registration', registration);
//         console.log('service worker en el scope', registration.scope);
//       })
//       .catch(err => console.log('Registro de service worker ha fallado', err));
//   });
// }

// if( window.Notification && Notification.permission !== 'denied' ){
//   Notification.requestPermission(status => {
//     console.log('status de notificacion', status);
//     let noti = new Notification('Aqui el Título', {
//       body: 'Hola! soy una notificación :D',
//       icon: './img/icon_192x192.png'
//     });
//   });
// }

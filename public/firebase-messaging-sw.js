importScripts("https://www.gstatic.com/firebasejs/7.16.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.16.0/firebase-messaging.js"
);
// import *  as firebase from 'firebase'
console.log("SERVICE WORKER WORKING NOEW");
firebase.initializeApp({
  apiKey: "AIzaSyD9NZEfb6xgMWUFJ7UweRiJeMsgbaAV6wk",
  authDomain: "alaseeldatescom.firebaseapp.com",
  databaseURL: "https://alaseeldatescom.firebaseio.com",
  projectId: "alaseeldatescom",
  storageBucket: "alaseeldatescom.appspot.com",
  messagingSenderId: "400892685998",
  appId: "1:400892685998:web:7279799df877be0ca8073f",
});

const messaging = firebase.messaging();
// messaging.setBackgroundMessageHandler((payload) => {
//    const notificationTitle = 'Background Message Title'
//    const notificationOptions = {
//       body: 'Background Message body.',
//       icon: '/firebase-logo.png',
//       actions: ['http://localhost:3000/controltower/controltower'],
//    }
//    return self.registration.showNotification(
//       notificationTitle,
//       notificationOptions
//    )
//    payload.data.notification.click_action =
//       'http://localhost:3000/controltower/controltower'
//    console.log('PAYLOAD', payload)
//    return payload.data.notification
// })

// self.addEventListener('notificationclick', (event) => {
//    console.log('check event now', event)
//    event.notification.close()

//    event.waitUntil(
//       self.clients.openWindow('http://localhost:3000/controltower/controltower')
//    )
// })
// self.addEventListener('notificationclick', function (event) {
//    console.log('On notification click: ', event)
//    event.notification.close()

//    // This looks to see if the current is already open and
//    // focuses if it is
//    event.waitUntil(
//       clients
//          .matchAll({
//             type: 'window',
//          })
//          .then(function (clientList) {
//             for (var i = 0; i < clientList.length; i++) {
//                var client = clientList[i]
//                if (client.url == '/' && 'focus' in client) return client.focus()
//             }
//             if (clients.openWindow)
//                return clients.openWindow('http://localhost:3000/controltower/controltower')
//          })
//    )
// })

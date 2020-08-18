import firebase from "firebase";
export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    initilizeFirebase();
  }
};
const initilizeFirebase = () => {
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
  messaging.onMessage((payload) => {
    navigator.serviceWorker
      .getRegistration("/firebase-cloud-messaging-push-scope")
      .then((registration) => {
        registration.showNotification(
          payload.notification.title,
          payload.notification
        );
      });
  });
};
export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();

    await messaging.requestPermission();
    const token = await messaging.getToken();
    return token;
  } catch (error) {
    console.error(error);
  }
};

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: "AIzaSyCw8olb0hPdifXkMEynEvlEq7lm5ps7ESU",
    authDomain: "gymplanner-e1632.firebaseapp.com",
    projectId: "gymplanner-e1632",
    storageBucket: "gymplanner-e1632.appspot.com",
    messagingSenderId: "477421182850",
    appId: "1:477421182850:web:6478eb158aafd37d73799b",
    measurementId: "G-73QEDH19P8"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
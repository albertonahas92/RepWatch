// Import the functions you need from the SDKs you need
import firebase from 'firebase';
import 'firebase/storage';
import 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCw8olb0hPdifXkMEynEvlEq7lm5ps7ESU",
    authDomain: "gymplanner-e1632.firebaseapp.com",
    projectId: "gymplanner-e1632",
    storageBucket: "gymplanner-e1632.appspot.com",
    messagingSenderId: "477421182850",
    appId: "1:477421182850:web:6478eb158aafd37d73799b",
    measurementId: "G-73QEDH19P8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
if (location.hostname === 'localhost') {
    firebase.firestore().useEmulator('localhost', 8080);
    firebase.functions().useEmulator('localhost', 5001);
}
const storage = firebase.storage();
let messaging: any;

try {
    messaging = firebase.messaging();
} catch (error) {
    console.log(error)
}

export const getToken = () => {
    if (!messaging) return
    return messaging.getToken({ vapidKey: 'BB-ZtExWjS9k8CCdK1gMs-adp2YAzKC7jAK53xD4BgiFP--4AvHUt3ZPI0oKeg1ALVz7VY85mEVNkAF_Dm45B2I' }).then((currentToken: any) => {
        if (currentToken) {
            return currentToken;
            // Track the token -> client mapping, by sending to backend server
            // show on the UI that permission is secured
        } else {
            return undefined
            // shows on the UI that permission is required 
        }
    }).catch((err: any) => {
        console.log('An error occurred while retrieving token. ', err);
        // catch error while creating client token
    });
}

export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging && messaging.onMessage((payload: any) => {
            resolve(payload);
        });
    });

export default firebase;

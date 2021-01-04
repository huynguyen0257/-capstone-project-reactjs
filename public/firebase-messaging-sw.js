importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyC9izJHMtdebUkfBHhLu6w9Xpa2ysEHfiw",
    authDomain: "sdms-captone-4ab5b.firebaseapp.com",
    databaseURL: "https://sdms-captone-4ab5b.firebaseio.com",
    projectId: "sdms-captone-4ab5b",
    storageBucket: "sdms-captone-4ab5b.appspot.com",
    messagingSenderId: "1083415409588",
    appId: "1:1083415409588:web:dcdf8e8c726494128038e1",
    measurementId: "G-GHMH3MV76W",
  };
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

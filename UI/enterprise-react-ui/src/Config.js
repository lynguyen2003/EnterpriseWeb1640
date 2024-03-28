// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Nhat thanh account
/* const firebaseConfig = {
    apiKey: 'AIzaSyDlTxhpWVoMzL8Ddawxz8cFtaaEY-nEU3Q',
    authDomain: 'greenwich-web-app.firebaseapp.com',
    projectId: 'greenwich-web-app',
    storageBucket: 'greenwich-web-app.appspot.com',
    messagingSenderId: '208464575246',
    appId: '1:208464575246:web:5371e092258410d0c7f55f',
}; */

// Ly Nguyen account
const firebaseConfig = {
    apiKey: 'AIzaSyBoaYPHiXqHXvnPmCgJlJ2lZgXPPTfE7TI',
    authDomain: 'greenwichweb-4f0ca.firebaseapp.com',
    projectId: 'greenwichweb-4f0ca',
    storageBucket: 'greenwichweb-4f0ca.appspot.com',
    messagingSenderId: '1087378909547',
    appId: '1:1087378909547:web:efea2caefffb36b8de442e',
    measurementId: 'G-FY2LH4HZ7E',
};

const app = initializeApp(firebaseConfig);

export const fileDb = getStorage(app);

// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- PEGA AQUÍ TUS DATOS DE FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDiP2DOwjMsc1eobH-U2quKYffwKNO9zjw",
    authDomain: "web-autos-alpha.firebaseapp.com",
    projectId: "web-autos-alpha",
    storageBucket: "web-autos-alpha.firebasestorage.app",
    messagingSenderId: "29872809696",
    appId: "1:29872809696:web:24b5a6f1d31ba7e451d285"
  };
// ----------------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, onSnapshot, deleteDoc, doc };
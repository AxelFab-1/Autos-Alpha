// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// Agregamos funciones de Auth
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Agregamos funciones de Query (where, query)
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, where, updateDoc, setDoc, getDoc, increment } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDiP2DOwjMsc1eobH-U2quKYffwKNO9zjw",
    authDomain: "web-autos-alpha.firebaseapp.com",
    projectId: "web-autos-alpha",
    storageBucket: "web-autos-alpha.firebasestorage.app",
    messagingSenderId: "29872809696",
    appId: "1:29872809696:web:24b5a6f1d31ba7e451d285"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Exportamos todo lo nuevo
export { 
    db, auth, provider, 
    collection, addDoc, onSnapshot, deleteDoc, doc, 
    signInWithPopup, signOut, onAuthStateChanged,
    query, where, updateDoc, setDoc, getDoc, increment // Importante para filtrar
};



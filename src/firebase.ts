// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyATA9aDKBJ3dT4GQ7QPjES1f0rFQtRXTA0",
  authDomain: "photo-booth-6b6c9.firebaseapp.com",
  databaseURL: "https://photo-booth-6b6c9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "photo-booth-6b6c9",
  storageBucket: "photo-booth-6b6c9.appspot.com",
  messagingSenderId: "215055437188",
  appId: "1:215055437188:web:336ea29f8eabc16b9261d1"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

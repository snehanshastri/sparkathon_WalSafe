// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
 apiKey: "AIzaSyAjVbXs_QDm307DQU3kjuhDYBUlat0qLhI",
  authDomain: "sparkathon-walsafe.firebaseapp.com",
  projectId: "sparkathon-walsafe",
  storageBucket: "sparkathon-walsafe.firebasestorage.app",
  messagingSenderId: "698003031353",
  appId: "1:698003031353:web:80c8a925a79ebab98b14e8",
  // ... from your Firebase console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

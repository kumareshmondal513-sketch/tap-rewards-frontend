// Firebase Client SDK configuration
// এই ফাইলটি Mini App বা Frontend-এর জন্য।
// এখানে কখনো Firebase Admin SDK-এর private key রাখবে না.

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase
} from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const clientDatabase = getDatabase(app);

export function getFirebaseClientConfig() {
  return { ...firebaseConfig };
}
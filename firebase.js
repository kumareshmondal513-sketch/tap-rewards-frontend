// Firebase client initialization
// Mini App-এর জন্য Firebase configuration প্রস্তুত করা হচ্ছে.

import { getClientFirebaseConfig } from './firebaseClient.js';

export function initializeFirebase() {
  const config = getClientFirebaseConfig();

  return config;
}
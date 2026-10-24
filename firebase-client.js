import { initializeApp, getApps } from 'firebase/app';
import {
  getDatabase,
  ref,
  get
} from 'firebase/database';

import config from './config.js';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let database = null;

export function initializeFirebaseClient() {
  const hasConfig =
    firebaseConfig.apiKey &&
    firebaseConfig.databaseURL &&
    firebaseConfig.projectId &&
    firebaseConfig.appId;

  if (!hasConfig) {
    console.warn(
      'Firebase client settings are missing.'
    );
    return null;
  }

  const app = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);

  database = getDatabase(app);
  return database;
}

export async function readPublicSetting(path) {
  if (!database) {
    throw new Error(
      'Firebase client has not been initialized.'
    );
  }

  if (
    typeof path !== 'string' ||
    !path ||
    path.includes('..') ||
    path.startsWith('/')
  ) {
    throw new Error('Invalid database path.');
  }

  const snapshot = await get(ref(database, path));
  return snapshot.exists() ? snapshot.val() : null;
}
export default database;

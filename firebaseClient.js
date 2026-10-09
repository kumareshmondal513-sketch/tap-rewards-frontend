// Mini App Firebase helper
// এখানে কোনো Firebase Admin secret বা private key থাকবে না.

import { getFirebaseConfig } from './firebaseConfig.js';

export function getClientFirebaseConfig() {
  const config = getFirebaseConfig();

  return {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
  };
}
import {
  initializeApp,
  cert,
  getApps
} from "firebase-admin/app";

import {
  getDatabase
} from "firebase-admin/database";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

let database = null;

if (
  projectId &&
  clientEmail &&
  privateKey &&
  databaseURL
) {
  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n")
        }),
        databaseURL
      });
    }

    database = getDatabase();
    console.log("Firebase connected");
  } catch (error) {
    console.error(
      "Firebase connection failed:",
      error.message
    );
  }
} else {
  console.log("Firebase credentials not configured");
}

export const db=database;

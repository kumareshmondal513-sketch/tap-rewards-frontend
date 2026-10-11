import dotenv from "dotenv";

dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN || "",
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "")
      .replace(/\\n/g, "\n")
  },

  adminId: process.env.ADMIN_ID || "",
  webAppUrl: process.env.WEBAPP_URL || ""
};

export default config;
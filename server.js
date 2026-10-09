import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import config from './config.js';
import { db } from './firebase.js';

import { createBot } from './bot.js';

import routes from './routes.js';
import tapRoutes from './tapRoutes.js';
import referralRoutes from './referralRoutes.js';
import rewardRoutes from './rewardRoutes.js';
import levelRoutes from './levelRoutes.js';
import energyRoutes from './energyRoutes.js';
import taskRoutes from './taskRoutes.js';
import taskUserRoutes from './taskUserRoutes.js';
import adminRoutes from './adminRoutes.js';
import userRoutes from './userRoutes.js';
import withdrawalRoutes from './withdrawalRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import adminSettingsRoutes from './adminSettingsRoutes.js';
import adRoutes from './adRoutes.js';
import notificationRoutes from './notificationRoutes.js';


// =====================================
// EXPRESS APP
// =====================================

const app = express();


// =====================================
// BASIC MIDDLEWARE
// =====================================

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(
  express.json({
    limit: '1mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb'
  })
);


// =====================================
// BASIC INFO
// =====================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message:
      'Telegram Tap-to-Earn Bot API is running.',
    status: 'online',
    version: '1.0.0'
  });
});


// =====================================
// HEALTH CHECK
// =====================================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    server: 'online',
    firebase: Boolean(db),
    environment:
      config.environment,
    time:
      new Date().toISOString()
  });
});


// =====================================
// PUBLIC CONFIG
// =====================================

app.get(
  '/api/config',
  (req, res) => {
    res.json({
      success: true,
      appName:
        'Telegram Tap-to-Earn',
      version: '1.0.0',
      webAppUrl:
        config.miniApp.url,
      firebaseConfigured:
        Boolean(db),
      botConfigured:
        Boolean(
          config.telegram.botToken
        )
    });
  }
);


// =====================================
// API ROUTES
// =====================================

// General
app.use(
  '/api',
  routes
);

// Users
app.use(
  '/api/users',
  userRoutes
);

// Tap-to-Earn
app.use(
  '/api/tap',
  tapRoutes
);

// Referral
app.use(
  '/api/referrals',
  referralRoutes
);

// Rewards
app.use(
  '/api/rewards',
  rewardRoutes
);

// Levels
app.use(
  '/api/levels',
  levelRoutes
);

// Energy
app.use(
  '/api/energy',
  energyRoutes
);

// Admin
app.use(
  '/api/admin',
  adminRoutes
);

// Admin Settings
app.use(
  '/api/admin/settings',
  adminSettingsRoutes
);

// Tasks
app.use(
  '/api/tasks',
  taskRoutes
);

// User Tasks
app.use(
  '/api/user-tasks',
  taskUserRoutes
);

// Withdrawals
app.use(
  '/api/withdrawals',
  withdrawalRoutes
);

// Transactions
app.use(
  '/api/transactions',
  transactionRoutes
);

// Ads
app.use(
  '/api/ads',
  adRoutes
);

// Notifications
app.use(
  '/api/notifications',
  notificationRoutes
);


// =====================================
// 404 HANDLER
// =====================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        'Route not found.'
    });
  }
);


// =====================================
// GLOBAL ERROR HANDLER
// =====================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      'Global server error:',
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({
      success: false,
      message:
        'Internal server error.'
    });
  }
);


// =====================================
// START TELEGRAM BOT
// =====================================

let bot = null;

try {
  bot = createBot();

  if (bot) {
    bot.launch()
      .then(() => {
        console.log(
          'Telegram bot started successfully.'
        );
      })
      .catch((error) => {
        console.error(
          'Telegram bot failed to start:',
          error.message
        );
      });
  }
} catch (error) {
  console.error(
    'Bot initialization error:',
    error.message
  );
}


// =====================================
// START EXPRESS SERVER
// =====================================

const PORT =
  Number(
    config.port || 3000
  );

const server =
  app.listen(
    PORT,
    () => {
      console.log('');
      console.log(
        '================================='
      );
      console.log(
        ' Telegram Tap-to-Earn Bot'
      );
      console.log(
        '================================='
      );
      console.log(
        `Server running on port ${PORT}`
      );
      console.log(
        `Health: http://localhost:${PORT}/health`
      );
      console.log(
        `Firebase: ${
          db
            ? 'Connected'
            : 'Not configured'
        }`
      );
      console.log(
        `Bot: ${
          bot
            ? 'Configured'
            : 'Not configured'
        }`
      );
      console.log(
        '================================='
      );
      console.log('');
    }
  );


// =====================================
// GRACEFUL SHUTDOWN
// =====================================

const shutdown = async (
  signal
) => {
  console.log(
    `${signal} received. Shutting down...`
  );

  try {
    if (bot) {
      bot.stop(signal);
    }
  } catch (error) {
    console.error(
      'Bot shutdown error:',
      error.message
    );
  }

  server.close(
    () => {
      console.log(
        'Server stopped.'
      );

      process.exit(0);
    }
  );
};


process.once(
  'SIGINT',
  () => shutdown('SIGINT')
);

process.once(
  'SIGTERM',
  () => shutdown('SIGTERM')
);
import express from 'express';
import { db } from './firebase.js'
const router = express.Router();

/*
  Health check
*/
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    firebase: Boolean(db),
    time: new Date().toISOString()
  });
});

/*
  Basic bot information
*/
router.get('/config', (req, res) => {
  res.json({
    success: true,
    appName: 'Telegram Tap-to-Earn',
    version: '1.0.0'
  });
});

/*
  Get user
*/
router.get('/user/:telegramId', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Firebase is not configured yet.'
      });
    }

    const { telegramId } = req.params;

    const snapshot = await db
      .ref(`users/${telegramId}`)
      .once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      user: snapshot.val()
    });
  } catch (error) {
    console.error('Get user error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to get user.'
    });
  }
});

export default router;

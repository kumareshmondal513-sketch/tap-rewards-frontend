import express from 'express';
import { db } from './firebase.js';

const router = express.Router();

// সার্ভারের স্বাস্থ্য পরীক্ষা
router.get('/', async (req, res) => {
  return res.json({
    success: true,
    status: 'ok',
    service: 'Telegram Tap-to-Earn Bot',
    timestamp: new Date().toISOString()
  });
});

// Firebase সংযোগ পরীক্ষা
router.get('/firebase', async (req, res) => {
  try {
    await db.ref('.info/connected').once('value');

    return res.json({
      success: true,
      message: 'Firebase পরীক্ষা সম্পন্ন'
    });
  } catch (error) {
    console.error(
      'Firebase health check failed:',
      error.message
    );

    return res.status(503).json({
      success: false,
      message: 'Firebase সংযোগ পরীক্ষা করা যায়নি'
    });
  }
});

export default router;
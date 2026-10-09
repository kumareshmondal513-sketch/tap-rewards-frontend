import express from 'express';
import { processTap, getTapSettings } from './tapService.js';

const router = express.Router();

/*
  Tap settings
*/
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    settings: getTapSettings()
  });
});

/*
  Process taps
*/
router.post('/tap', async (req, res) => {
  try {
    const { telegramId, tapCount } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'telegramId is required.'
      });
    }

    const user = await processTap(
      String(telegramId),
      tapCount || 1
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Tap route error:', error.message);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
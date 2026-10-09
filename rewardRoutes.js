import express from 'express';
import {
  claimDailyReward,
  getDailyRewardAmount
} from './rewardService.js';

const router = express.Router();

router.get('/daily', (req, res) => {
  res.json({
    success: true,
    reward: getDailyRewardAmount()
  });
});

router.post('/daily/claim', async (req, res) => {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'telegramId is required.'
      });
    }

    const result = await claimDailyReward(
      String(telegramId)
    );

    res.json(result);
  } catch (error) {
    console.error(
      'Daily reward error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
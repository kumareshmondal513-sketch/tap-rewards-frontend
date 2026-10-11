import express from 'express';

import {
  getLeaderboard
} from './leaderboardService.js';

import {
  requireTelegramAuth
} from './telegramAuth.js';

const router = express.Router();

// সেরা ইউজারদের তালিকা
router.get(
  '/',
  requireTelegramAuth,
  async (req, res) => {
    try {
      const limit = req.query.limit || 10;

      const result = await getLeaderboard(limit);

      return res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error(
        'Leaderboard error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        message: 'লিডারবোর্ড লোড করা যায়নি'
      });
    }
  }
);

export default router;
import express from 'express';

import {
  adjustUserCoins
} from './coinManagementService.js';

import {
  requireTelegramAuth
} from './telegramAuth.js';

import {
  requireAdminAuth
} from './adminAuthMiddleware.js';

import {
  createAdminLog
} from './adminLogService.js';

const router = express.Router();

// ইউজারের কয়েন বাড়ানো বা কমানো
router.post(
  '/adjust',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const {
        userId,
        amount,
        reason
      } = req.body;

      const adminId = req.auth.telegramUserId;

      if (
        !userId ||
        amount === undefined ||
        !reason
      ) {
        return res.status(400).json({
          success: false,
          message: 'সব তথ্য দিতে হবে'
        });
      }

      const result = await adjustUserCoins({
        userId,
        adminId,
        amount,
        reason
      });

      await createAdminLog({
        adminId,
        action: 'USER_COINS_ADJUSTED',
        details: {
          userId: String(userId),
          amount: Number(amount),
          reason: String(reason),
          newBalance: result.newBalance
        }
      });

      return res.json(result);
    } catch (error) {
      console.error(
        'Coin adjustment error:',
        error.message
      );

      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

export default router;
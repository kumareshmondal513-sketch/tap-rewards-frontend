import express from 'express';

import {
  banUser,
  unbanUser,
  getBanStatus
} from './banService.js';

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

// ইউজারের ব্লক স্ট্যাটাস দেখা
router.get(
  '/:userId',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const status = await getBanStatus(
        req.params.userId
      );

      return res.json({
        success: true,
        userId: req.params.userId,
        status
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// ইউজারকে ব্লক করা
router.post(
  '/:userId',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const adminId =
        req.auth.telegramUserId;

      const result = await banUser({
        userId: req.params.userId,
        adminId,
        reason: req.body.reason,
        durationMs: req.body.durationMs ?? 0
      });

      await createAdminLog({
        adminId,
        action: 'USER_BANNED',
        details: {
          userId: result.userId,
          reason: result.ban.reason,
          expiresAt: result.ban.expiresAt
        }
      });

      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// ইউজারের ব্লক তুলে দেওয়া
router.delete(
  '/:userId',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const adminId =
        req.auth.telegramUserId;

      const result = await unbanUser({
        userId: req.params.userId,
        adminId
      });

      await createAdminLog({
        adminId,
        action: 'USER_UNBANNED',
        details: {
          userId: result.userId
        }
      });

      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

export default router;
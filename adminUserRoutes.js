import express from 'express';

import {
  getAdminUser,
  suspendUser,
  activateUser
} from './adminUserService.js';

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

// নির্দিষ্ট ইউজারের তথ্য দেখা
router.get(
  '/:userId',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const user = await getAdminUser(
        req.params.userId
      );

      return res.json({
        success: true,
        user
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
);

// ইউজার স্থগিত করা
router.post(
  '/:userId/suspend',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const { reason } = req.body;
      const userId = req.params.userId;
      const adminId = req.auth.telegramUserId;

      const result = await suspendUser({
        userId,
        adminId,
        reason
      });

      await createAdminLog({
        adminId,
        action: 'USER_SUSPENDED',
        details: {
          userId,
          reason
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

// ইউজার পুনরায় সক্রিয় করা
router.post(
  '/:userId/activate',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const adminId = req.auth.telegramUserId;

      const result = await activateUser({
        userId,
        adminId
      });

      await createAdminLog({
        adminId,
        action: 'USER_ACTIVATED',
        details: {
          userId
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
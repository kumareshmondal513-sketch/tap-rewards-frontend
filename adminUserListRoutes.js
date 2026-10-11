import express from 'express';

import {
  getAdminUserList
} from './adminUserListService.js';

import {
  requireTelegramAuth
} from './telegramAuth.js';

import {
  requireAdminAuth
} from './adminAuthMiddleware.js';

const router = express.Router();

// অ্যাডমিনের জন্য ইউজার তালিকা
router.get(
  '/',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const {
        limit = 50,
        status = ''
      } = req.query;

      const result = await getAdminUserList({
        limit,
        status
      });

      return res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error(
        'Admin user list error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        message: 'ইউজার তালিকা লোড করা যায়নি'
      });
    }
  }
);

export default router;
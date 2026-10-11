import express from 'express';

import {
  getAdminDashboard
} from './adminDashboardService.js';

import {
  requireTelegramAuth
} from './telegramAuth.js';

import {
  requireAdminAuth
} from './adminAuthMiddleware.js';

const router = express.Router();

// অ্যাডমিন ড্যাশবোর্ডের সারাংশ
router.get(
  '/',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const dashboard = await getAdminDashboard();

      return res.json({
        success: true,
        dashboard
      });
    } catch (error) {
      console.error(
        'Admin dashboard error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        message: 'ড্যাশবোর্ডের তথ্য লোড করা যায়নি'
      });
    }
  }
);

export default router;
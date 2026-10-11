import express from 'express';

import {
  getAdminLogs,
  getAdminLogsByUser
} from './adminLogService.js';

import {
  requireAdminAuth
} from './adminAuthMiddleware.js';

const router = express.Router();

// সব অ্যাডমিন লগ দেখা
router.get(
  '/',
  requireAdminAuth,
  async (req, res) => {
    try {
      const limit = req.query.limit || 50;

      const logs = await getAdminLogs(limit);

      return res.json({
        success: true,
        total: logs.length,
        logs
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'অ্যাডমিন লগ লোড করা যায়নি'
      });
    }
  }
);

// নির্দিষ্ট অ্যাডমিনের লগ দেখা
router.get(
  '/:adminId',
  requireAdminAuth,
  async (req, res) => {
    try {
      const { adminId } = req.params;

      // নিজের লগ ছাড়া অন্যের লগ দেখতে
      // আলাদা অনুমতি যাচাই প্রয়োজন।
      if (
        String(req.auth.telegramUserId) !==
        String(adminId)
      ) {
        return res.status(403).json({
          success: false,
          message: 'এই লগ দেখার অনুমতি নেই'
        });
      }

      const limit = req.query.limit || 50;

      const logs = await getAdminLogsByUser(
        adminId,
        limit
      );

      return res.json({
        success: true,
        total: logs.length,
        logs
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'অ্যাডমিন লগ লোড করা যায়নি'
      });
    }
  }
);

export default router;
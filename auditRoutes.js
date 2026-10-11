import express from 'express';

import {
  getRecentAuditEvents
} from './auditService.js';

import {
  requireTelegramAuth
} from './telegramAuth.js';

import {
  requireAdminAuth
} from './adminAuthMiddleware.js';

const router = express.Router();

// সাম্প্রতিক অডিট লগ দেখা
router.get(
  '/',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const limit = Number(
        req.query.limit || 50
      );

      if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            'limit অবশ্যই ১ থেকে ১০০ হতে হবে'
        });
      }

      const events =
        await getRecentAuditEvents(limit);

      return res.json({
        success: true,
        count: events.length,
        events
      });
    } catch (error) {
      console.error(
        'Audit log error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          'অডিট লগ লোড করা যায়নি'
      });
    }
  }
);

export default router;
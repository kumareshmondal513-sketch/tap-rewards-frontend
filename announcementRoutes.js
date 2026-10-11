import express from 'express';

import {
  createAnnouncement,
  getActiveAnnouncements,
  setAnnouncementStatus
} from './announcementService.js';

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

// ইউজারদের জন্য সক্রিয় ঘোষণা
router.get(
  '/',
  async (req, res) => {
    try {
      const announcements =
        await getActiveAnnouncements();

      return res.json({
        success: true,
        announcements
      });
    } catch (error) {
      console.error(
        'Announcement load error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        message: 'ঘোষণা লোড করা যায়নি'
      });
    }
  }
);

// অ্যাডমিনের নতুন ঘোষণা তৈরি
router.post(
  '/',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const adminId =
        req.auth.telegramUserId;

      const result = await createAnnouncement({
        adminId,
        title: req.body.title,
        message: req.body.message
      });

      await createAdminLog({
        adminId,
        action: 'ANNOUNCEMENT_CREATED',
        details: {
          announcementId: result.announcementId,
          title: result.announcement.title
        }
      });

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// অ্যাডমিনের ঘোষণা চালু বা বন্ধ
router.patch(
  '/:announcementId/status',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const adminId =
        req.auth.telegramUserId;

      const result = await setAnnouncementStatus({
        announcementId:
          req.params.announcementId,
        active: req.body.active
      });

      await createAdminLog({
        adminId,
        action: 'ANNOUNCEMENT_STATUS_CHANGED',
        details: result
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
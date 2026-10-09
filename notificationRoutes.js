import express from 'express';

import {
  getNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  getUserNotifications
} from './notificationService.js';

const router = express.Router();


// ===============================
// GET USER NOTIFICATIONS
// ===============================
router.get(
  '/user/:telegramId',
  async (req, res) => {
    try {
      const { telegramId } =
        req.params;

      const notifications =
        await getUserNotifications(
          String(telegramId)
        );

      res.json({
        success: true,
        notifications
      });
    } catch (error) {
      console.error(
        'Get user notifications error:',
        error.message
      );

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);


// ===============================
// MARK AS READ
// ===============================
router.post(
  '/user/:telegramId/:notificationId/read',
  async (req, res) => {
    try {
      const {
        telegramId,
        notificationId
      } = req.params;

      const result =
        await markAsRead(
          String(telegramId),
          String(notificationId)
        );

      res.json(result);
    } catch (error) {
      console.error(
        'Mark notification read error:',
        error.message
      );

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);


// ===============================
// GET ALL NOTIFICATIONS
// ===============================
router.get(
  '/',
  async (req, res) => {
    try {
      const notifications =
        await getNotifications();

      res.json({
        success: true,
        notifications
      });
    } catch (error) {
      console.error(
        'Get notifications error:',
        error.message
      );

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);


// ===============================
// GET ONE NOTIFICATION
// ===============================
router.get(
  '/:notificationId',
  async (req, res) => {
    try {
      const { notificationId } =
        req.params;

      const notification =
        await getNotification(
          String(notificationId)
        );

      res.json({
        success: true,
        notification
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
);


// ===============================
// CREATE NOTIFICATION
// ===============================
router.post(
  '/',
  async (req, res) => {
    try {
      const notification =
        await createNotification(
          req.body
        );

      res.json({
        success: true,
        notification
      });
    } catch (error) {
      console.error(
        'Create notification error:',
        error.message
      );

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);


// ===============================
// UPDATE NOTIFICATION
// ===============================
router.put(
  '/:notificationId',
  async (req, res) => {
    try {
      const { notificationId } =
        req.params;

      const notification =
        await updateNotification(
          String(notificationId),
          req.body
        );

      res.json({
        success: true,
        notification
      });
    } catch (error) {
      console.error(
        'Update notification error:',
        error.message
      );

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);


// ===============================
// DELETE NOTIFICATION
// ===============================
router.delete(
  '/:notificationId',
  async (req, res) => {
    try {
      const { notificationId } =
        req.params;

      const result =
        await deleteNotification(
          String(notificationId)
        );

      res.json(result);
    } catch (error) {
      console.error(
        'Delete notification error:',
        error.message
      );

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);


export default router;
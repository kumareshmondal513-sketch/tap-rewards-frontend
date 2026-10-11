import express from 'express';

import {
  notifyActiveAdmins,
  notifyWithdrawalRequest,
  notifyVerificationRequest
} from './adminNotificationService.js';

const router = express.Router();

// সক্রিয় অ্যাডমিনদের নোটিফিকেশন পাঠানো
router.post('/notify', async (req, res) => {
  try {
    const { title, message } = req.body;

    const result = await notifyActiveAdmins({
      title,
      message
    });

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// উইথড্রয়াল আবেদনের নোটিফিকেশন
router.post('/withdrawal', async (req, res) => {
  try {
    const {
      userId,
      amount,
      withdrawalId
    } = req.body;

    if (
      !userId ||
      amount === undefined ||
      !withdrawalId
    ) {
      return res.status(400).json({
        success: false,
        message: 'সব তথ্য দিতে হবে'
      });
    }

    const result = await notifyWithdrawalRequest({
      userId,
      amount,
      withdrawalId
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'নোটিফিকেশন পাঠানো যায়নি'
    });
  }
});

// ভেরিফিকেশন আবেদনের নোটিফিকেশন
router.post('/verification', async (req, res) => {
  try {
    const { userId, fullName } = req.body;

    if (!userId || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'User ID এবং নাম দিতে হবে'
      });
    }

    const result = await notifyVerificationRequest({
      userId,
      fullName
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'নোটিফিকেশন পাঠানো যায়নি'
    });
  }
});

export default router;
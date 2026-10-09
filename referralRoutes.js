import express from 'express';
import {
  registerReferral,
  getReferralInfo
} from './referralService.js';

const router = express.Router();

router.get('/:telegramId', async (req, res) => {
  try {
    const info = await getReferralInfo(
      String(req.params.telegramId)
    );

    res.json({
      success: true,
      referral: info
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { newUserId, referralCode } = req.body;

    if (!newUserId) {
      return res.status(400).json({
        success: false,
        message: 'newUserId is required.'
      });
    }

    const result = await registerReferral(
      String(newUserId),
      referralCode
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
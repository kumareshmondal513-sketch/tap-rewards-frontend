import express from 'express';

import {
  getWithdrawalSettings,
  updateWithdrawalSettings,
  createWithdrawal,
  getWithdrawals,
  updateWithdrawalStatus
} from './withdrawalService.js';

const router = express.Router();


// ===============================
// GET WITHDRAWAL SETTINGS
// ===============================
router.get('/settings', async (req, res) => {
  try {
    const settings =
      await getWithdrawalSettings();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// UPDATE WITHDRAWAL SETTINGS
// ===============================
router.put('/settings', async (req, res) => {
  try {
    const settings =
      await updateWithdrawalSettings(
        req.body
      );

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// CREATE WITHDRAWAL
// ===============================
router.post('/', async (req, res) => {
  try {
    const {
      telegramId,
      amount,
      method,
      accountNumber,
      accountName
    } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'telegramId is required.'
      });
    }

    const withdrawal =
      await createWithdrawal(
        String(telegramId),
        {
          amount,
          method,
          accountNumber,
          accountName
        }
      );

    res.json({
      success: true,
      withdrawal
    });
  } catch (error) {
    console.error(
      'Create withdrawal error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// GET USER WITHDRAWALS
// ===============================
router.get(
  '/user/:telegramId',
  async (req, res) => {
    try {
      const withdrawals =
        await getUserWithdrawals(
          String(req.params.telegramId)
        );

      res.json({
        success: true,
        withdrawals
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);


// ===============================
// GET ALL WITHDRAWALS
// ===============================
router.get('/admin/all', async (req, res) => {
  try {
    const withdrawals =
      await getAllWithdrawals();

    res.json({
      success: true,
      withdrawals
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// UPDATE WITHDRAWAL STATUS
// ===============================
router.put(
  '/admin/:withdrawalId/status',
  async (req, res) => {
    try {
      const {
        withdrawalId
      } = req.params;

      const {
        status,
        adminNote
      } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required.'
        });
      }

      const withdrawal =
        await updateWithdrawalStatus(
          withdrawalId,
          status,
          adminNote || ''
        );

      res.json({
        success: true,
        withdrawal
      });
    } catch (error) {
      console.error(
        'Update withdrawal error:',
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

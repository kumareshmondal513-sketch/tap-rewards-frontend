import express from 'express';

import {
  getUserTransactions,
  getTransaction,
  createTransaction
} from './transactionService.js';

const router = express.Router();


// ===============================
// GET USER TRANSACTIONS
// ===============================
router.get(
  '/:telegramId',
  async (req, res) => {
    try {
      const { telegramId } = req.params;

      const transactions =
        await getUserTransactions(
          String(telegramId)
        );

      res.json({
        success: true,
        transactions
      });
    } catch (error) {
      console.error(
        'Get transactions error:',
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
// GET ONE TRANSACTION
// ===============================
router.get(
  '/:telegramId/:transactionId',
  async (req, res) => {
    try {
      const {
        telegramId,
        transactionId
      } = req.params;

      const transaction =
        await getTransaction(
          String(telegramId),
          String(transactionId)
        );

      res.json({
        success: true,
        transaction
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
// CREATE TRANSACTION
// ===============================
router.post(
  '/',
  async (req, res) => {
    try {
      const {
        telegramId,
        type,
        amount,
        reason,
        status,
        taskId
      } = req.body;

      if (!telegramId) {
        return res.status(400).json({
          success: false,
          message:
            'telegramId is required.'
        });
      }

      const transaction =
        await createTransaction(
          String(telegramId),
          {
            type,
            amount,
            reason,
            status,
            taskId
          }
        );

      res.json({
        success: true,
        transaction
      });
    } catch (error) {
      console.error(
        'Create transaction error:',
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
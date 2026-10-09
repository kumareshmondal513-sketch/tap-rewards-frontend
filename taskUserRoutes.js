import express from 'express';

import {
  getUserTaskStatus,
  isTaskCompleted,
  completeTask,
  getUserTasks
} from './taskUserService.js';

const router = express.Router();


// ===============================
// GET USER TASKS
// ===============================
router.get('/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;

    const tasks = await getUserTasks(
      String(telegramId)
    );

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error(
      'Get user tasks error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// CHECK TASK STATUS
// ===============================
router.get(
  '/:telegramId/:taskId/status',
  async (req, res) => {
    try {
      const {
        telegramId,
        taskId
      } = req.params;

      const completed =
        await isTaskCompleted(
          String(telegramId),
          String(taskId)
        );

      res.json({
        success: true,
        completed
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
// GET ONE TASK STATUS
// ===============================
router.get(
  '/:telegramId/:taskId',
  async (req, res) => {
    try {
      const {
        telegramId,
        taskId
      } = req.params;

      const status =
        await getUserTaskStatus(
          String(telegramId),
          String(taskId)
        );

      res.json({
        success: true,
        status
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
// COMPLETE TASK
// ===============================
router.post(
  '/:telegramId/:taskId/complete',
  async (req, res) => {
    try {
      const {
        telegramId,
        taskId
      } = req.params;

      const {
        verificationCode
      } = req.body;

      const result =
        await completeTask(
          String(telegramId),
          String(taskId),
          verificationCode || ''
        );

      res.json(result);
    } catch (error) {
      console.error(
        'Complete task error:',
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
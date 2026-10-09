import express from 'express';

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from './taskService.js';

const router = express.Router();


// ===============================
// GET ALL TASKS
// ===============================
router.get('/', async (req, res) => {
  try {
    const tasks = await getTasks();

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error(
      'Get tasks error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// CREATE TASK
// ===============================
router.post('/', async (req, res) => {
  try {
    const task = await createTask(req.body);

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error(
      'Create task error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// UPDATE TASK
// ===============================
router.put('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await updateTask(
      taskId,
      req.body
    );

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error(
      'Update task error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// DELETE TASK
// ===============================
router.delete('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await deleteTask(taskId);

    res.json(result);
  } catch (error) {
    console.error(
      'Delete task error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


export default router;
import express from 'express';

import {
  getUser,
  createUser,
  updateUser
} from './userService.js';

const router = express.Router();


// ===============================
// GET USER
// ===============================
router.get('/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await getUser(
      String(telegramId)
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(
      'Get user error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// CREATE USER
// ===============================
router.post('/', async (req, res) => {
  try {
    const {
      id,
      first_name,
      last_name,
      username
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Telegram user ID is required.'
      });
    }

    const user = await createUser({
      id,
      first_name,
      last_name,
      username
    });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(
      'Create user error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// UPDATE USER
// ===============================
router.put('/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await updateUser(
      String(telegramId),
      req.body
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(
      'Update user error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


export default router;
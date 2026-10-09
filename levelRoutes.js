import express from 'express';
import {
  calculateLevel,
  getLevelProgress,
  updateUserLevel
} from './levelService.js';

const router = express.Router();

router.get('/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;

    const result = await updateUserLevel(
      String(telegramId)
    );

    res.json({
      success: true,
      level: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/calculate/:xp', (req, res) => {
  const xp = Number(req.params.xp || 0);

  res.json({
    success: true,
    level: calculateLevel(xp),
    progress: getLevelProgress(xp)
  });
});

export default router;
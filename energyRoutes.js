import express from 'express';
import {
  getEnergy,
  refillEnergy,
  upgradeMaxEnergy
} from './energyService.js';

const router = express.Router();

router.get('/:telegramId', async (req, res) => {
  try {
    const energy = await getEnergy(
      String(req.params.telegramId)
    );

    res.json({
      success: true,
      energy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/refill', async (req, res) => {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'telegramId is required.'
      });
    }

    const result = await refillEnergy(
      String(telegramId)
    );

    res.json({
      success: true,
      energy: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/upgrade', async (req, res) => {
  try {
    const {
      telegramId,
      increase
    } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'telegramId is required.'
      });
    }

    const result = await upgradeMaxEnergy(
      String(telegramId),
      increase || 1000
    );

    res.json({
      success: true,
      energy: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
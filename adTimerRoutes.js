import express from 'express';

import {
  startAdTimer,
  completeAdTimer,
  getAdTimer
} from './adTimerService.js';

const router = express.Router();

// বিজ্ঞাপনের টাইমার শুরু
router.post('/start', async (req, res) => {
  try {
    const {
      userId,
      adId,
      durationSeconds
    } = req.body;

    const result = await startAdTimer({
      userId,
      adId,
      durationSeconds
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error(
      'Start ad timer error:',
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// বিজ্ঞাপনের টাইমার সম্পন্ন হয়েছে কি না
router.post('/complete', async (req, res) => {
  try {
    const {
      userId,
      adId
    } = req.body;

    const result = await completeAdTimer({
      userId,
      adId
    });

    return res.status(
      result.success ? 200 : 400
    ).json(result);
  } catch (error) {
    console.error(
      'Complete ad timer error:',
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// টাইমারের অবস্থা দেখা
router.get('/:userId/:adId', async (req, res) => {
  try {
    const {
      userId,
      adId
    } = req.params;

    const timer = await getAdTimer({
      userId,
      adId
    });

    if (!timer) {
      return res.status(404).json({
        success: false,
        message: 'টাইমার পাওয়া যায়নি'
      });
    }

    return res.json({
      success: true,
      timer
    });
  } catch (error) {
    console.error(
      'Get ad timer error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'সার্ভারে সমস্যা হয়েছে'
    });
  }
});

export default router;
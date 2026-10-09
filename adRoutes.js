import express from 'express';

import {
  getAds,
  getAd,
  createAd,
  updateAd,
  deleteAd,
  setAdStatus
} from './adService.js';

const router = express.Router();


// ===============================
// GET ALL ADS
// ===============================
router.get('/', async (req, res) => {
  try {
    const ads = await getAds();

    res.json({
      success: true,
      ads
    });
  } catch (error) {
    console.error(
      'Get ads error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// GET ONE AD
// ===============================
router.get('/:adId', async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await getAd(
      String(adId)
    );

    res.json({
      success: true,
      ad
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// CREATE AD
// ===============================
router.post('/', async (req, res) => {
  try {
    const ad = await createAd(
      req.body
    );

    res.json({
      success: true,
      ad
    });
  } catch (error) {
    console.error(
      'Create ad error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// UPDATE AD
// ===============================
router.put(
  '/:adId',
  async (req, res) => {
    try {
      const { adId } =
        req.params;

      const ad = await updateAd(
        String(adId),
        req.body
      );

      res.json({
        success: true,
        ad
      });
    } catch (error) {
      console.error(
        'Update ad error:',
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
// ENABLE / DISABLE AD
// ===============================
router.post(
  '/:adId/status',
  async (req, res) => {
    try {
      const { adId } =
        req.params;

      const { enabled } =
        req.body;

      const ad =
        await setAdStatus(
          String(adId),
          enabled
        );

      res.json({
        success: true,
        ad
      });
    } catch (error) {
      console.error(
        'Ad status error:',
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
// DELETE AD
// ===============================
router.delete(
  '/:adId',
  async (req, res) => {
    try {
      const { adId } =
        req.params;

      const result =
        await deleteAd(
          String(adId)
        );

      res.json(result);
    } catch (error) {
      console.error(
        'Delete ad error:',
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
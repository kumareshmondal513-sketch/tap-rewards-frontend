import express from 'express';

import {
  getSettings,
  getSettingGroup,
  updateSettings,
  updateSettingGroup,
  setMaintenanceMode,
  isMaintenanceMode
} from './adminSettingsService.js';

const router = express.Router();


// ===============================
// GET ALL SETTINGS
// ===============================
router.get('/', async (req, res) => {
  try {
    const settings =
      await getSettings();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error(
      'Get settings error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// GET ONE SETTING GROUP
// ===============================
router.get(
  '/group/:group',
  async (req, res) => {
    try {
      const { group } =
        req.params;

      const settings =
        await getSettingGroup(group);

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
  }
);


// ===============================
// UPDATE ALL SETTINGS
// ===============================
router.put('/', async (req, res) => {
  try {
    const settings =
      await updateSettings(
        req.body
      );

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error(
      'Update settings error:',
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// ===============================
// UPDATE ONE SETTING GROUP
// ===============================
router.put(
  '/group/:group',
  async (req, res) => {
    try {
      const { group } =
        req.params;

      const settings =
        await updateSettingGroup(
          group,
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
  }
);


// ===============================
// SET MAINTENANCE MODE
// ===============================
router.post(
  '/maintenance',
  async (req, res) => {
    try {
      const { enabled } =
        req.body;

      const settings =
        await setMaintenanceMode(
          enabled
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
  }
);


// ===============================
// CHECK MAINTENANCE MODE
// ===============================
router.get(
  '/maintenance/status',
  async (req, res) => {
    try {
      const enabled =
        await isMaintenanceMode();

      res.json({
        success: true,
        maintenanceMode:
          enabled
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);


export default router;
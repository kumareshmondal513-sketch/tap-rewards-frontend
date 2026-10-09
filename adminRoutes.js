import express from 'express';

import {
  isAdmin,
  createAdmin,
  updateAdmin,
  suspendAdmin,
  activateAdmin,
  removeAdmin,
  getAllAdmins,
  getAdminPermissions
} from './adminService.js';

const router = express.Router();


// ===============================
// ADMIN ACCESS CHECK
// ===============================
async function requireAdmin(
  req,
  res,
  next
) {
  try {
    const telegramId =
      req.headers['x-telegram-id'] ||
      req.body?.telegramId ||
      req.query?.telegramId;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message: 'Telegram ID is required.'
      });
    }

    const access = await isAdmin(
      String(telegramId)
    );

    if (!access) {
      return res.status(403).json({
        success: false,
        message: 'Admin access denied.'
      });
    }

    req.adminTelegramId =
      String(telegramId);

    next();
  } catch (error) {
    console.error(
      'Admin access error:',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Admin authorization failed.'
    });
  }
}


// ===============================
// CHECK ADMIN
// ===============================
router.get(
  '/check',
  requireAdmin,
  async (req, res) => {
    try {
      const permissions =
        await getAdminPermissions(
          req.adminTelegramId
        );

      res.json({
        success: true,
        admin: true,
        permissions
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
// GET ALL ADMINS
// ===============================
router.get(
  '/',
  requireAdmin,
  async (req, res) => {
    try {
      const admins =
        await getAllAdmins();

      res.json({
        success: true,
        admins
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
// CREATE SUB-ADMIN
// ===============================
router.post(
  '/',
  requireAdmin,
  async (req, res) => {
    try {
      const {
        telegramId,
        name,
        username,
        role,
        permissions
      } = req.body;

      const admin =
        await createAdmin(
          String(telegramId),
          {
            name,
            username,
            role,
            permissions
          }
        );

      res.json({
        success: true,
        admin
      });
    } catch (error) {
      console.error(
        'Create admin error:',
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
// UPDATE ADMIN
// ===============================
router.put(
  '/:telegramId',
  requireAdmin,
  async (req, res) => {
    try {
      const { telegramId } =
        req.params;

      const admin =
        await updateAdmin(
          String(telegramId),
          req.body
        );

      res.json({
        success: true,
        admin
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
// SUSPEND ADMIN
// ===============================
router.post(
  '/:telegramId/suspend',
  requireAdmin,
  async (req, res) => {
    try {
      const { telegramId } =
        req.params;

      const admin =
        await suspendAdmin(
          String(telegramId)
        );

      res.json({
        success: true,
        admin
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
// ACTIVATE ADMIN
// ===============================
router.post(
  '/:telegramId/activate',
  requireAdmin,
  async (req, res) => {
    try {
      const { telegramId } =
        req.params;

      const admin =
        await activateAdmin(
          String(telegramId)
        );

      res.json({
        success: true,
        admin
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
// REMOVE SUB-ADMIN
// ===============================
router.delete(
  '/:telegramId',
  requireAdmin,
  async (req, res) => {
    try {
      const { telegramId } =
        req.params;

      const result =
        await removeAdmin(
          String(telegramId)
        );

      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);


export default router;
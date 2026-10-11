import express from "express";
import {
  getAdmin,
  isAdmin,
  getAllAdmins,
  addAdmin,
  setAdminStatus,
  removeAdmin
} from "./adminService.js";

const router = express.Router();

// Check whether an admin is active
router.get("/:adminId/check", async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!/^\d+$/.test(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID"
      });
    }

    const active = await isAdmin(adminId);

    return res.json({
      success: true,
      adminId,
      isAdmin: active
    });
  } catch (error) {
    console.error("Admin check error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to check admin"
    });
  }
});

// List admins
router.get("/", async (req, res) => {
  try {
    const admins = await getAllAdmins();

    return res.json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    console.error("Get admins error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get admins"
    });
  }
});

// Get one admin
router.get("/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!/^\d+$/.test(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID"
      });
    }

    const admin = await getAdmin(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    return res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error("Get admin error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get admin"
    });
  }
});

// Add an admin
router.post("/", async (req, res) => {
  try {
    const { adminId, role, addedBy } = req.body || {};

    if (!adminId || !addedBy) {
      return res.status(400).json({
        success: false,
        message: "adminId and addedBy are required"
      });
    }

    const creatorIsAdmin = await isAdmin(addedBy);

    if (!creatorIsAdmin) {
      return res.status(403).json({
        success: false,
        message: "Active admin access required"
      });
    }

    const creator = await getAdmin(addedBy);

    if (creator.role !== "main_admin") {
      return res.status(403).json({
        success: false,
        message: "Only the main admin can add admins"
      });
    }

    const admin = await addAdmin(
      adminId,
      role || "admin",
      addedBy
    );

    return res.status(201).json({
      success: true,
      message: "Admin added",
      data: admin
    });
  } catch (error) {
    const clientErrors = [
      "Invalid admin ID",
      "Invalid admin role",
      "Admin already exists"
    ];

    const knownError = clientErrors.includes(error.message);

    return res.status(knownError ? 400 : 500).json({
      success: false,
      message: knownError
        ? error.message
        : "Failed to add admin"
    });
  }
});

// Activate or deactivate an admin
router.patch("/:adminId/status", async (req, res) => {
  try {
    const { adminId } = req.params;
    const { active, changedBy } = req.body || {};

    if (!/^\d+$/.test(adminId) || !changedBy) {
      return res.status(400).json({
        success: false,
        message: "Valid adminId and changedBy are required"
      });
    }

    if (typeof active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "active must be true or false"
      });
    }

    const creator = await getAdmin(changedBy);

    if (!creator || creator.active !== true ||
        creator.role !== "main_admin") {
      return res.status(403).json({
        success: false,
        message: "Main admin access required"
      });
    }

    const admin = await setAdminStatus(adminId, active);

    return res.json({
      success: true,
      message: "Admin status updated",
      data: admin
    });
  } catch (error) {
    const clientErrors = [
      "Admin not found",
      "Main admin cannot be deactivated",
      "Active status must be true or false"
    ];

    const knownError = clientErrors.includes(error.message);

    return res.status(
      error.message === "Admin not found"
        ? 404
        : knownError
          ? 400
          : 500
    ).json({
      success: false,
      message: knownError
        ? error.message
        : "Failed to update admin status"
    });
  }
});

// Remove an admin
router.delete("/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const { removedBy } = req.body || {};

    if (!/^\d+$/.test(adminId) || !removedBy) {
      return res.status(400).json({
        success: false,
        message: "Valid adminId and removedBy are required"
      });
    }

    const creator = await getAdmin(removedBy);

    if (!creator || creator.active !== true ||
        creator.role !== "main_admin") {
      return res.status(403).json({
        success: false,
        message: "Main admin access required"
      });
    }

    const result = await removeAdmin(adminId);

    return res.json({
      success: true,
      message: "Admin removed",
      data: result
    });
  } catch (error) {
    const clientErrors = [
      "Admin not found",
      "Main admin cannot be removed"
    ];

    const knownError = clientErrors.includes(error.message);

    return res.status(
      error.message === "Admin not found"
        ? 404
        : knownError
          ? 400
          : 500
    ).json({
      success: false,
      message: knownError
        ? error.message
        : "Failed to remove admin"
    });
  }
});

export default router;
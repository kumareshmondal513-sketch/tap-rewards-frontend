import express from "express";
import {
  getAllAds,
  getActiveAds,
  getAd,
  createAd,
  updateAd,
  deleteAd
} from "./adService.js";
import { getAdmin } from "./adminService.js";

const router = express.Router();

async function requireMainAdmin(adminId) {
  if (!adminId || !/^\d+$/.test(String(adminId))) {
    return false;
  }

  const admin = await getAdmin(adminId);

  return Boolean(
    admin &&
    admin.active === true &&
    admin.role === "main_admin"
  );
}

// Public: list active ads
router.get("/active", async (req, res) => {
  try {
    const ads = await getActiveAds();

    return res.json({
      success: true,
      count: ads.length,
      data: ads
    });
  } catch (error) {
    console.error("Get active ads error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get active ads"
    });
  }
});

// Admin: list all ads
router.get("/", async (req, res) => {
  try {
    if (!await requireMainAdmin(req.get("x-admin-id"))) {
      return res.status(403).json({
        success: false,
        message: "Main admin access required"
      });
    }

    const ads = await getAllAds();

    return res.json({
      success: true,
      count: ads.length,
      data: ads
    });
  } catch (error) {
    console.error("Get ads error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get ads"
    });
  }
});

// Admin: get one ad
router.get("/:adId", async (req, res) => {
  try {
    if (!await requireMainAdmin(req.get("x-admin-id"))) {
      return res.status(403).json({
        success: false,
        message: "Main admin access required"
      });
    }

    const ad = await getAd(req.params.adId);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found"
      });
    }

    return res.json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error("Get ad error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get ad"
    });
  }
});

// Admin: create an ad
router.post("/", async (req, res) => {
  try {
    const adminId = req.get("x-admin-id");

    if (!await requireMainAdmin(adminId)) {
      return res.status(403).json({
        success: false,
        message: "Main admin access required"
      });
    }

    const ad = await createAd(req.body || {});

    return res.status(201).json({
      success: true,
      message: "Ad created",
      data: ad
    });
  } catch (error) {
    const clientErrors = [
      "Invalid ad URL",
      "Ad URL must use HTTP or HTTPS",
      "Ad duration must be between 0 and 3600 seconds"
    ];

    const knownError =
      clientErrors.includes(error.message) ||
      error.message.startsWith("Ad title");

    return res.status(knownError ? 400 : 500).json({
      success: false,
      message: knownError ? error.message : "Failed to create ad"
    });
  }
});

// Admin: update an ad
router.patch("/:adId", async (req, res) => {
  try {
    if (!await requireMainAdmin(req.get("x-admin-id"))) {
      return res.status(403).json({
        success: false,
        message: "Main admin access required"
      });
    }

    const ad = await updateAd(
      req.params.adId,
      req.body || {}
    );

    return res.json({
      success: true,
      message: "Ad updated",
      data: ad
    });
  } catch (error) {
    const knownError = [
      "Ad not found",
      "Invalid ad title",
      "Invalid ad URL",
      "Ad URL must use HTTP or HTTPS",
      "Ad duration must be between 0 and 3600 seconds",
      "No valid ad updates provided"
    ].includes(error.message);

    return res.status(
      error.message === "Ad not found"
        ? 404
        : knownError
          ? 400
          : 500
    ).json({
      success: false,
      message: knownError ? error.message : "Failed to update ad"
    });
  }
});

// Admin: delete an ad
router.delete("/:adId", async (req, res) => {
  try {
    if (!await requireMainAdmin(req.get("x-admin-id"))) {
      return res.status(403).json({
        success: false,
        message: "Main admin access required"
      });
    }

    const result = await deleteAd(req.params.adId);

    return res.json({
      success: true,
      message: "Ad deleted",
      data: result
    });
  } catch (error) {
    const notFound = error.message === "Ad not found";

    return res.status(notFound ? 404 : 500).json({
      success: false,
      message: notFound ? error.message : "Failed to delete ad"
    });
  }
});

export default router;
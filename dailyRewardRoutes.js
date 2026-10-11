import express from "express";
import {
  claimDailyReward,
  getDailyRewardStatus
} from "./dailyRewardService.js";

const router = express.Router();

// Check daily reward status
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const status = await getDailyRewardStatus(userId);

    return res.json({
      success: true,
      data: status
    });
  } catch (error) {
    const notFound = error.message === "User not found";

    return res.status(notFound ? 404 : 500).json({
      success: false,
      message: notFound
        ? error.message
        : "Failed to get daily reward status"
    });
  }
});

// Claim daily reward
router.post("/:userId/claim", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const result = await claimDailyReward(userId);

    return res.json({
      success: true,
      message: "Daily reward claimed",
      data: result
    });
  } catch (error) {
    const notFound = error.message === "User not found";
    const alreadyClaimed =
      error.message === "Daily reward already claimed";

    return res.status(
      notFound ? 404 : alreadyClaimed ? 409 : 500
    ).json({
      success: false,
      message: notFound || alreadyClaimed
        ? error.message
        : "Failed to claim daily reward"
    });
  }
});

export default router;
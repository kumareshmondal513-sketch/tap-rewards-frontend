import express from "express";
import {
  getUserLevel,
  addXp
} from "./levelService.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const levelInfo = await getUserLevel(userId);

    return res.json({
      success: true,
      data: levelInfo
    });
  } catch (error) {
    return res.status(
      error.message === "User not found" ? 404 : 500
    ).json({
      success: false,
      message: error.message === "User not found"
        ? error.message
        : "Internal server error"
    });
  }
});

router.post("/:userId/xp", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const result = await addXp(userId, req.body?.amount);

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    const invalidAmount = error.message === "Invalid XP amount";
    const userMissing = error.message === "User not found";

    return res.status(
      invalidAmount ? 400 : userMissing ? 404 : 500
    ).json({
      success: false,
      message: invalidAmount || userMissing
        ? error.message
        : "Internal server error"
    });
  }
});

export default router;
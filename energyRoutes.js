import express from "express";
import {
  getEnergy,
  refillEnergy
} from "./energyService.js";

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

    const energy = await getEnergy(userId);

    return res.json({
      success: true,
      data: energy
    });
  } catch (error) {
    const status = error.message === "User not found"
      ? 404
      : 500;

    return res.status(status).json({
      success: false,
      message: status === 500
        ? "Internal server error"
        : error.message
    });
  }
});

router.post("/:userId/refill", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const result = await refillEnergy(userId);

    return res.json({
      success: true,
      message: "Energy refilled",
      data: result
    });
  } catch (error) {
    const status = error.message === "User not found"
      ? 404
      : 500;

    return res.status(status).json({
      success: false,
      message: status === 500
        ? "Internal server error"
        : error.message
    });
  }
});

export default router;
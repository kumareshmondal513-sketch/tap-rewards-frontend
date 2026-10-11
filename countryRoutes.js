import express from 'express';

import {
  getCountryUserCounts
} from './countryService.js';

import {
  requireTelegramAuth
} from './telegramAuth.js';

import {
  requireAdminAuth
} from './adminAuthMiddleware.js';

const router = express.Router();

// দেশ অনুযায়ী ইউজারের সংখ্যা
router.get(
  '/stats',
  requireTelegramAuth,
  requireAdminAuth,
  async (req, res) => {
    try {
      const counts =
        await getCountryUserCounts();

      const totalUsers = Object.values(counts)
        .reduce((total, count) => total + count, 0);

      return res.json({
        success: true,
        totalUsers,
        countries: counts
      });
    } catch (error) {
      console.error(
        'Country statistics error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          'দেশভিত্তিক পরিসংখ্যান লোড করা যায়নি'
      });
    }
  }
);

export default router;
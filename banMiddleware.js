import {
  getBanStatus
} from './banService.js';

export async function banMiddleware(
  req,
  res,
  next
) {
  try {
    const userId = req.auth?.telegramUserId;

    // Telegram authentication না থাকলে
    // এই middleware সিদ্ধান্ত নেবে না।
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'লগইন যাচাই করা হয়নি'
      });
    }

    const status = await getBanStatus(userId);

    if (!status.banned) {
      return next();
    }

    // সাময়িক ব্লকের মেয়াদ শেষ হলে
    if (
      status.expiresAt > 0 &&
      Date.now() >= status.expiresAt
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      banned: true,
      message:
        status.reason ||
        'আপনার অ্যাকাউন্ট সাময়িকভাবে বন্ধ রয়েছে',
      expiresAt: status.expiresAt
    });
  } catch (error) {
    console.error(
      'Ban check failed:',
      error.message
    );

    // ব্লক যাচাই করা না গেলে অনুরোধ বন্ধ থাকবে।
    return res.status(503).json({
      success: false,
      message:
        'অ্যাকাউন্ট যাচাই করা যাচ্ছে না। পরে চেষ্টা করুন।'
    });
  }
}
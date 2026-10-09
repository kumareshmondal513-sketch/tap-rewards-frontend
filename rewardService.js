import { db } from './firebase.js';

const DAILY_REWARD = 500;

export async function claimDailyReward(telegramId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const userRef = db.ref(`users/${telegramId}`);
  const snapshot = await userRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('User not found.');
  }

  const user = snapshot.val();
  const now = Date.now();

  const lastClaim = Number(user.lastDailyReward || 0);
  const oneDay = 24 * 60 * 60 * 1000;

  if (now - lastClaim < oneDay) {
    const remaining = oneDay - (now - lastClaim);

    return {
      success: false,
      message: 'Daily reward already claimed.',
      remainingMs: remaining
    };
  }

  const updatedCoins =
    Number(user.coins || 0) + DAILY_REWARD;

  const updatedTotal =
    Number(user.totalEarned || 0) + DAILY_REWARD;

  await userRef.update({
    coins: updatedCoins,
    totalEarned: updatedTotal,
    lastDailyReward: now,
    updatedAt: now
  });

  return {
    success: true,
    reward: DAILY_REWARD,
    coins: updatedCoins
  };
}

export function getDailyRewardAmount() {
  return DAILY_REWARD;
}
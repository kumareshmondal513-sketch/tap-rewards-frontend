import { db } from './firebase.js';

const TAP_REWARD = 1;
const ENERGY_PER_TAP = 1;

export async function processTap(telegramId, tapCount = 1) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  tapCount = Number(tapCount);

  if (
    !Number.isInteger(tapCount) ||
    tapCount < 1 ||
    tapCount > 100
  ) {
    throw new Error('Invalid tap count.');
  }

  const userRef = db.ref(`users/${telegramId}`);

  const result = await userRef.transaction((user) => {
    if (!user) {
      return user;
    }

    const currentEnergy = Number(user.energy || 0);

    if (currentEnergy < tapCount * ENERGY_PER_TAP) {
      return;
    }

    user.coins =
      Number(user.coins || 0) +
      tapCount * TAP_REWARD;

    user.energy =
      currentEnergy -
      tapCount * ENERGY_PER_TAP;

    user.totalTaps =
      Number(user.totalTaps || 0) +
      tapCount;

    user.totalEarned =
      Number(user.totalEarned || 0) +
      tapCount * TAP_REWARD;

    user.xp =
      Number(user.xp || 0) +
      tapCount;

    user.updatedAt = Date.now();

    return user;
  });

  if (!result.committed) {
    throw new Error(
      'Not enough energy or tap could not be processed.'
    );
  }

  return result.snapshot.val();
}

export function getTapSettings() {
  return {
    rewardPerTap: TAP_REWARD,
    energyPerTap: ENERGY_PER_TAP,
    maxTapBatch: 100
  };
}
import { db } from './firebase.js';

const DEFAULT_MAX_ENERGY = 1000;
const ENERGY_REGEN_PER_SECOND = 1;

export async function getEnergy(telegramId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const ref = db.ref(`users/${telegramId}`);
  const snapshot = await ref.once('value');

  if (!snapshot.exists()) {
    throw new Error('User not found.');
  }

  const user = snapshot.val();

  const maxEnergy =
    Number(user.maxEnergy || DEFAULT_MAX_ENERGY);

  const currentEnergy =
    Number(user.energy || 0);

  return {
    energy: Math.min(currentEnergy, maxEnergy),
    maxEnergy,
    regenPerSecond: ENERGY_REGEN_PER_SECOND
  };
}

export async function refillEnergy(telegramId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const ref = db.ref(`users/${telegramId}`);

  const result = await ref.transaction((user) => {
    if (!user) {
      return user;
    }

    const maxEnergy =
      Number(user.maxEnergy || DEFAULT_MAX_ENERGY);

    user.energy = maxEnergy;
    user.updatedAt = Date.now();

    return user;
  });

  if (!result.committed) {
    throw new Error('Energy refill failed.');
  }

  return {
    energy: result.snapshot.val().energy,
    maxEnergy: result.snapshot.val().maxEnergy
  };
}

export async function upgradeMaxEnergy(
  telegramId,
  increase = 1000
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  increase = Number(increase);

  if (!Number.isInteger(increase) || increase <= 0) {
    throw new Error('Invalid energy upgrade.');
  }

  const ref = db.ref(`users/${telegramId}`);

  const result = await ref.transaction((user) => {
    if (!user) {
      return user;
    }

    const currentMax =
      Number(user.maxEnergy || DEFAULT_MAX_ENERGY);

    const currentEnergy =
      Number(user.energy || 0);

    const newMax = currentMax + increase;

    user.maxEnergy = newMax;

    user.energy = Math.min(
      currentEnergy + increase,
      newMax
    );

    user.updatedAt = Date.now();

    return user;
  });

  if (!result.committed) {
    throw new Error('Energy upgrade failed.');
  }

  const user = result.snapshot.val();

  return {
    energy: user.energy,
    maxEnergy: user.maxEnergy
  };
}
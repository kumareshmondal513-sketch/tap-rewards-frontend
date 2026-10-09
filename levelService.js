import { db } from './firebase.js';

const XP_PER_LEVEL = 1000;

export function calculateLevel(xp = 0) {
  return Math.max(
    1,
    Math.floor(Number(xp) / XP_PER_LEVEL) + 1
  );
}

export function getLevelProgress(xp = 0) {
  const currentXp = Number(xp) || 0;
  const level = calculateLevel(currentXp);

  const levelStartXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;

  return {
    level,
    currentXp,
    levelStartXp,
    nextLevelXp,
    progressXp: currentXp - levelStartXp,
    requiredXp: XP_PER_LEVEL,
    progressPercent: Math.min(
      100,
      Math.floor(
        ((currentXp - levelStartXp) / XP_PER_LEVEL) * 100
      )
    )
  };
}

export async function updateUserLevel(telegramId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const userRef = db.ref(`users/${telegramId}`);
  const snapshot = await userRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('User not found.');
  }

  const user = snapshot.val();
  const xp = Number(user.xp || 0);
  const level = calculateLevel(xp);

  await userRef.update({
    level,
    updatedAt: Date.now()
  });

  return {
    level,
    ...getLevelProgress(xp)
  };
}
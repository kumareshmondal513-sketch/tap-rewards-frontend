import { apiGet } from './apiClient.js';

export async function getLevelInfo() {
  return apiGet('/api/levels');
}

export function getLevelProgress(profile) {
  if (!profile || typeof profile !== 'object') {
    return {
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      progress: 0
    };
  }

  const level = Number(profile.level);
  const xp = Number(profile.xp);
  const nextLevelXp = Number(profile.nextLevelXp);

  const safeLevel =
    Number.isSafeInteger(level) && level >= 1
      ? level
      : 1;

  const safeXp =
    Number.isSafeInteger(xp) && xp >= 0
      ? xp
      : 0;

  const safeNextXp =
    Number.isSafeInteger(nextLevelXp) &&
    nextLevelXp > 0
      ? nextLevelXp
      : 100;

  const progress = Math.max(
    0,
    Math.min(100, Math.floor((safeXp / safeNextXp) * 100))
  );

  return {
    level: safeLevel,
    xp: safeXp,
    nextLevelXp: safeNextXp,
    progress
  };
}
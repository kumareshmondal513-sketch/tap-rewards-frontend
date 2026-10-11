import { apiGet } from './apiClient.js';

export async function getProfile() {
  return apiGet('/api/profile');
}

export function getDisplayName(profile) {
  if (!profile || typeof profile !== 'object') {
    return 'Player';
  }

  const firstName =
    typeof profile.firstName === 'string'
      ? profile.firstName.trim()
      : '';

  const username =
    typeof profile.username === 'string'
      ? profile.username.trim()
      : '';

  return firstName || username || 'Player';
}

export function getDisplayBalance(profile) {
  if (!profile || typeof profile !== 'object') {
    return '0';
  }

  const balance = Number(profile.balance);

  if (
    !Number.isSafeInteger(balance) ||
    balance < 0
  ) {
    return '0';
  }

  return balance.toLocaleString();
}

export function getDisplayLevel(profile) {
  const level = Number(profile?.level);

  if (
    !Number.isSafeInteger(level) ||
    level < 1
  ) {
    return 1;
  }

  return level;
}
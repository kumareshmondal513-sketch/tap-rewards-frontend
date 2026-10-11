import { apiGet, apiPost } from './apiClient.js';

export async function getDailyRewardInfo() {
  return apiGet('/api/rewards/daily');
}

export async function claimDailyReward() {
  return apiPost('/api/rewards/daily/claim', {});
}

export function canClaimDailyReward(info) {
  if (!info || typeof info !== 'object') {
    return false;
  }

  return info.canClaim === true;
}

export function formatRewardAmount(amount) {
  const value = Number(amount);

  if (
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    return '0';
  }

  return value.toLocaleString();
}
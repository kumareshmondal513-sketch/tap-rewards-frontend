import {
  apiGet,
  apiPost
} from './apiClient.js';

export async function fetchUserProfile() {
  return apiGet('/api/profile');
}

export async function submitTapToBackend() {
  return apiPost('/api/tap', {
    action: 'tap'
  });
}

export async function fetchAvailableTasks() {
  return apiGet('/api/tasks');
}

export async function fetchDailyReward() {
  return apiGet('/api/rewards/daily');
}

export async function claimDailyReward() {
  return apiPost('/api/rewards/daily/claim');
}

export async function fetchReferralInfo() {
  return apiGet('/api/referrals');
}

export async function fetchAppSettings() {
  return apiGet('/api/settings');
}
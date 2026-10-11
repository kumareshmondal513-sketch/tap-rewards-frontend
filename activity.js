import { apiGet } from './apiClient.js';

export async function getRecentActivity(limit = 20) {
  const safeLimit =
    Number.isSafeInteger(limit) &&
    limit >= 1 &&
    limit <= 100
      ? limit
      : 20;

  return apiGet(
    `/api/activity?limit=${safeLimit}`
  );
}

export function formatActivityDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function getActivityDescription(activity) {
  if (!activity || typeof activity !== 'object') {
    return 'Activity';
  }

  const descriptions = {
    tap: 'Tap reward',
    daily_reward: 'Daily reward',
    task_reward: 'Task reward',
    referral_reward: 'Referral reward',
    withdrawal: 'Withdrawal request',
    energy_refill: 'Energy refill'
  };

  return descriptions[activity.type] || 'Activity';
}
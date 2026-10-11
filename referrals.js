import { apiGet } from './apiClient.js';

export async function getReferralDetails() {
  return apiGet('/api/referrals');
}

export function createReferralLink(botUsername, referralCode) {
  if (
    typeof botUsername !== 'string' ||
    !/^[A-Za-z0-9_]{5,32}$/.test(botUsername)
  ) {
    throw new Error('Invalid Telegram bot username.');
  }

  if (
    typeof referralCode !== 'string' ||
    !/^[A-Za-z0-9_-]{1,64}$/.test(referralCode)
  ) {
    throw new Error('Invalid referral code.');
  }

  const startParameter = `ref_${referralCode}`;

  return (
    `https://t.me/${botUsername}` +
    `?start=${encodeURIComponent(startParameter)}`
  );
}

export async function copyReferralLink(link) {
  if (
    typeof link !== 'string' ||
    !link.startsWith('https://t.me/')
  ) {
    throw new Error('Invalid referral link.');
  }

  if (!navigator.clipboard?.writeText) {
    throw new Error(
      'Copy is not supported in this browser.'
    );
  }

  await navigator.clipboard.writeText(link);

  return true;
}
export const APP_NAME = 'Tap Rewards';

export const APP_VERSION = '1.0.0';

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  'en',
  'bn'
];

export const STORAGE_KEYS = {
  DEMO_BALANCE: 'demoBalance',
  USER_ID: 'userId',
  LANGUAGE: 'language'
};

export const API_ENDPOINTS = {
  PROFILE: '/api/profile',
  TAP: '/api/tap',
  TASKS: '/api/tasks',
  SETTINGS: '/api/settings',
  REFERRALS: '/api/referrals',
  DAILY_REWARD: '/api/rewards/daily',
  CLAIM_DAILY_REWARD: '/api/rewards/daily/claim'
};

export const LIMITS = {
  MAX_DEMO_BALANCE: 1000000000,
  MAX_ERROR_MESSAGE_LENGTH: 200
};

export const UI_MESSAGES = {
  READY: 'Ready to play?',
  TAP_SUCCESS: 'Coin earned!',
  NETWORK_ERROR:
    'Network error. Please check your connection.',
  GENERAL_ERROR:
    'Something went wrong. Please try again.'
};
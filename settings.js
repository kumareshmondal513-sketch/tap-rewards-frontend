import { apiGet } from './apiClient.js';

import {
  getLocalData,
  saveLocalData
} from './storage.js';

const DEFAULT_SETTINGS = {
  language: 'en',
  soundEnabled: true,
  theme: 'dark'
};

export function getUserSettings() {
  const saved = getLocalData('userSettings', {});

  if (
    !saved ||
    typeof saved !== 'object' ||
    Array.isArray(saved)
  ) {
    return { ...DEFAULT_SETTINGS };
  }

  return {
    ...DEFAULT_SETTINGS,
    language: ['en', 'bn'].includes(saved.language)
      ? saved.language
      : DEFAULT_SETTINGS.language,
    soundEnabled: typeof saved.soundEnabled === 'boolean'
      ? saved.soundEnabled
      : DEFAULT_SETTINGS.soundEnabled,
    theme: ['dark', 'light'].includes(saved.theme)
      ? saved.theme
      : DEFAULT_SETTINGS.theme
  };
}

export function saveUserSettings(updates = {}) {
  const current = getUserSettings();

  const next = {
    ...current,
    ...(updates.language !== undefined &&
    ['en', 'bn'].includes(updates.language)
      ? { language: updates.language }
      : {}),
    ...(typeof updates.soundEnabled === 'boolean'
      ? { soundEnabled: updates.soundEnabled }
      : {}),
    ...(updates.theme !== undefined &&
    ['dark', 'light'].includes(updates.theme)
      ? { theme: updates.theme }
      : {})
  };

  saveLocalData('userSettings', next);

  return next;
}

export async function getRemoteSettings() {
  return apiGet('/api/settings');
}

export { DEFAULT_SETTINGS };
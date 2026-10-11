import {
  getTelegramInitData
} from './telegram.js';

const API_BASE_URL = (
  window.TAPBOT_API_URL || ''
).replace(/\/+$/, '');

async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      'Server URL is not configured yet.'
    );
  }

  const initData = getTelegramInitData();

  if (!initData) {
    throw new Error(
      'Open the Mini App through Telegram first.'
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': initData,
        ...options.headers
      }
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

export async function getProfile() {
  return apiRequest('/api/profile');
}

export async function submitTap() {
  return apiRequest('/api/tap', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export async function getTasks() {
  return apiRequest('/api/tasks');
}
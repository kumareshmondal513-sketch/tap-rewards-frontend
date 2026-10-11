import { getTelegramInitData } from './telegram.js';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/+$/, '');

export async function apiRequest(
  path,
  options = {}
) {
  if (!API_BASE_URL) {
    throw new Error(
      'Backend URL is not configured.'
    );
  }

  if (
    typeof path !== 'string' ||
    !path.startsWith('/') ||
    path.startsWith('//')
  ) {
    throw new Error('Invalid API path.');
  }

  const initData = getTelegramInitData();

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {})
  };

  if (initData) {
    headers['X-Telegram-Init-Data'] = initData;
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
      credentials: 'omit'
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      'The server returned an invalid response.'
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Request failed (${response.status}).`
    );
  }

  return data;
}

export function apiGet(path) {
  return apiRequest(path, {
    method: 'GET'
  });
}

export function apiPost(path, body = {}) {
  return apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}
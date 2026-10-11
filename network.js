export function isOnline() {
  return navigator.onLine;
}

export function onConnectionChange(callback) {
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function.');
  }

  const handleOnline = () => {
    callback(true);
  };

  const handleOffline = () => {
    callback(false);
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return function cleanup() {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

export async function checkServerHealth(baseUrl) {
  if (typeof baseUrl !== 'string' || !baseUrl.trim()) {
    return {
      online: false,
      message: 'Backend URL is not configured.'
    };
  }

  try {
    const url = new URL(baseUrl);

    if (!['https:', 'http:'].includes(url.protocol)) {
      throw new Error('Invalid protocol.');
    }

    const response = await fetch(
      `${url.origin}/health`,
      {
        method: 'GET',
        cache: 'no-store',
        credentials: 'omit',
        signal: AbortSignal.timeout(5000)
      }
    );

    return {
      online: response.ok,
      message: response.ok
        ? 'Backend is reachable.'
        : 'Backend health check failed.'
    };
  } catch {
    return {
      online: false,
      message: 'Unable to connect to the backend.'
    };
  }
}
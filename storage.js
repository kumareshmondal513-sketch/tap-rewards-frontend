const PREFIX = 'tapbot_';

export function saveLocalData(key, value) {
  if (
    typeof key !== 'string' ||
    !/^[a-zA-Z0-9_-]+$/.test(key)
  ) {
    throw new Error('Invalid storage key');
  }

  try {
    localStorage.setItem(
      PREFIX + key,
      JSON.stringify(value)
    );

    return true;
  } catch {
    return false;
  }
}

export function getLocalData(key, fallback = null) {
  if (
    typeof key !== 'string' ||
    !/^[a-zA-Z0-9_-]+$/.test(key)
  ) {
    return fallback;
  }

  try {
    const value = localStorage.getItem(PREFIX + key);

    return value === null
      ? fallback
      : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function removeLocalData(key) {
  if (
    typeof key !== 'string' ||
    !/^[a-zA-Z0-9_-]+$/.test(key)
  ) {
    return false;
  }

  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch {
    return false;
  }
}

export function clearTapbotLocalData() {
  try {
    const keys = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(PREFIX)) {
        keys.push(key);
      }
    }

    keys.forEach((key) => {
      localStorage.removeItem(key);
    });

    return true;
  } catch {
    return false;
  }
}
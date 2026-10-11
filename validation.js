export function isValidTelegramUser(user) {
  return Boolean(
    user &&
    Number.isSafeInteger(Number(user.id)) &&
    Number(user.id) > 0
  );
}

export function isValidCoinAmount(value) {
  const amount = Number(value);

  return (
    Number.isSafeInteger(amount) &&
    amount >= 0 &&
    amount <= 1000000000
  );
}

export function isValidUsername(value) {
  if (typeof value !== 'string') {
    return false;
  }

  return /^[a-zA-Z0-9_]{5,32}$/.test(value);
}

export function isValidHttpUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
}
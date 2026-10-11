// Telegram Mini App connection helper

const telegram = window.Telegram?.WebApp ?? null;

export function initTelegram() {
  if (!telegram) {
    return {
      connected: false,
      user: null,
      message: 'Telegram Mini App is not available.'
    };
  }

  telegram.ready();
  telegram.expand();

  return {
    connected: true,
    user: telegram.initDataUnsafe?.user ?? null,
    message: 'Telegram Mini App connected.'
  };
}

export function getTelegramUser() {
  if (!telegram) {
    return null;
  }

  return telegram.initDataUnsafe?.user ?? null;
}

export function getTelegramInitData() {
  if (!telegram) {
    return '';
  }

  return telegram.initData ?? '';
}

export function showTelegramAlert(message) {
  if (telegram?.showAlert) {
    telegram.showAlert(String(message));
  } else {
    console.log(String(message));
  }
}
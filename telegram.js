const telegram =
  window.Telegram?.WebApp || null;


// =====================================
// INITIALIZE TELEGRAM MINI APP
// =====================================

export function initTelegram() {
  if (!telegram) {
    console.warn(
      'Telegram WebApp API not found.'
    );

    return null;
  }

  telegram.ready();

  telegram.expand();

  try {
    telegram.setHeaderColor(
      '#111827'
    );

    telegram.setBackgroundColor(
      '#111827'
    );
  } catch (error) {
    console.warn(
      'Telegram color setup failed:',
      error.message
    );
  }

  return telegram;
}


// =====================================
// GET TELEGRAM USER
// =====================================

export function getTelegramUser() {
  return (
    telegram
      ?.initDataUnsafe
      ?.user || null
  );
}


// =====================================
// GET TELEGRAM USER ID
// =====================================

export function getTelegramUserId() {
  const user =
    getTelegramUser();

  return user?.id
    ? String(user.id)
    : null;
}


// =====================================
// GET RAW INIT DATA
// =====================================

export function getInitData() {
  return (
    telegram?.initData || ''
  );
}


// =====================================
// CHECK TELEGRAM APP
// =====================================

export function isTelegramApp() {
  return Boolean(telegram);
}


// =====================================
// CLOSE MINI APP
// =====================================

export function closeTelegramApp() {
  if (telegram) {
    telegram.close();
  }
}


// =====================================
// SHOW TELEGRAM ALERT
// =====================================

export function showTelegramAlert(
  message
) {
  if (
    telegram &&
    typeof telegram.showAlert ===
      'function'
  ) {
    telegram.showAlert(
      String(message)
    );

    return;
  }

  alert(String(message));
}


// =====================================
// SHOW CONFIRMATION
// =====================================

export function showTelegramConfirm(
  message,
  callback
) {
  if (
    telegram &&
    typeof telegram.showConfirm ===
      'function'
  ) {
    telegram.showConfirm(
      String(message),
      callback
    );

    return;
  }

  const result =
    window.confirm(
      String(message)
    );

  if (typeof callback === 'function') {
    callback(result);
  }
}


// =====================================
// HAPTIC FEEDBACK
// =====================================

export function hapticImpact(
  style = 'medium'
) {
  try {
    telegram
      ?.HapticFeedback
      ?.impactOccurred(style);
  } catch (error) {
    console.warn(
      'Haptic feedback failed:',
      error.message
    );
  }
}


export function hapticNotification(
  type = 'success'
) {
  try {
    telegram
      ?.HapticFeedback
      ?.notificationOccurred(type);
  } catch (error) {
    console.warn(
      'Haptic notification failed:',
      error.message
    );
  }
}


// =====================================
// MAIN BUTTON
// =====================================

export function showMainButton(
  text,
  callback
) {
  if (!telegram?.MainButton) {
    return;
  }

  telegram.MainButton.setText(
    String(text)
  );

  telegram.MainButton.show();

  telegram.MainButton.offClick();

  telegram.MainButton.onClick(
    callback
  );
}


export function hideMainButton() {
  telegram?.MainButton?.hide();
}


// =====================================
// BACK BUTTON
// =====================================

export function showBackButton(
  callback
) {
  if (!telegram?.BackButton) {
    return;
  }

  telegram.BackButton.show();

  telegram.BackButton.offClick();

  telegram.BackButton.onClick(
    callback
  );
}


export function hideBackButton() {
  telegram?.BackButton?.hide();
}


// =====================================
// SHARE MESSAGE
// =====================================

export function shareUrl(
  url,
  text = ''
) {
  const shareText =
    text
      ? `${text}\n${url}`
      : url;

  if (
    telegram &&
    typeof telegram.openTelegramLink ===
      'function'
  ) {
    const encoded =
      encodeURIComponent(
        shareText
      );

    telegram.openTelegramLink(
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encoded}`
    );

    return;
  }

  if (
    navigator.share
  ) {
    navigator.share({
      title:
        'Tap Rewards',
      text: shareText,
      url
    }).catch(() => {});
  }
}


// =====================================
// GET START PARAMETER
// =====================================

export function getStartParam() {
  return (
    telegram
      ?.initDataUnsafe
      ?.start_param || ''
  );
}


// =====================================
// GET PLATFORM
// =====================================

export function getPlatform() {
  return (
    telegram
      ?.platform || ''
  );
}


// =====================================
// GET COLOR SCHEME
// =====================================

export function getColorScheme() {
  return (
    telegram
      ?.colorScheme || 'dark'
  );
}
const MAX_LOG_LENGTH = 500;

function sanitizeMessage(value) {
  const message = String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim();

  return message.slice(0, MAX_LOG_LENGTH);
}

export function logInfo(message, details) {
  console.info(
    '[TapRewards]',
    sanitizeMessage(message),
    details ?? ''
  );
}

export function logWarning(message, details) {
  console.warn(
    '[TapRewards]',
    sanitizeMessage(message),
    details ?? ''
  );
}

export function logError(message, error) {
  const safeMessage = sanitizeMessage(message);

  console.error(
    '[TapRewards]',
    safeMessage,
    error instanceof Error
      ? error.message
      : ''
  );
}
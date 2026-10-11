const MAX_TEXT_LENGTH = 500;

export function escapeHtml(value) {
  const text = String(value ?? '');

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function cleanText(value, maxLength = MAX_TEXT_LENGTH) {
  if (typeof value !== 'string') {
    return '';
  }

  const safeLimit =
    Number.isSafeInteger(maxLength) &&
    maxLength >= 1 &&
    maxLength <= 5000
      ? maxLength
      : MAX_TEXT_LENGTH;

  return value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, safeLimit);
}

export function isSafeHttpUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      ['https:', 'http:'].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function safeExternalUrl(value) {
  if (!isSafeHttpUrl(value)) {
    return null;
  }

  return value;
}
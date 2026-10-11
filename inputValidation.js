// Telegram user ID যাচাই
export function validateTelegramUserId(userId) {
  const id = String(userId ?? '').trim();

  if (!/^\d{1,20}$/.test(id)) {
    return {
      valid: false,
      message: 'সঠিক Telegram User ID দিতে হবে'
    };
  }

  return {
    valid: true,
    value: id
  };
}

// পূর্ণসংখ্যা যাচাই
export function validateInteger(
  value,
  { min = 0, max = 1000000 } = {}
) {
  const number = Number(value);

  if (
    !Number.isSafeInteger(number) ||
    number < min ||
    number > max
  ) {
    return {
      valid: false,
      message:
        `মানটি ${min} থেকে ${max}-এর মধ্যে হতে হবে`
    };
  }

  return {
    valid: true,
    value: number
  };
}

// সাধারণ টেক্সট যাচাই
export function validateText(
  value,
  { minLength = 1, maxLength = 500 } = {}
) {
  if (typeof value !== 'string') {
    return {
      valid: false,
      message: 'টেক্সট দিতে হবে'
    };
  }

  const text = value.trim();

  if (
    text.length < minLength ||
    text.length > maxLength
  ) {
    return {
      valid: false,
      message:
        `টেক্সট ${minLength} থেকে ${maxLength} অক্ষরের মধ্যে হতে হবে`
    };
  }

  return {
    valid: true,
    value: text
  };
}
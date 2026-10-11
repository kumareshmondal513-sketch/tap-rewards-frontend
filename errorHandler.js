export function getErrorMessage(error) {
  if (!error) {
    return 'An unexpected error occurred.';
  }

  if (error instanceof TypeError) {
    return 'Network error. Please check your connection.';
  }

  if (typeof error.message === 'string') {
    const message = error.message.trim();

    if (message.length > 0 && message.length <= 200) {
      return message;
    }
  }

  return 'Something went wrong. Please try again.';
}

export function handleError(error, options = {}) {
  const message = getErrorMessage(error);

  console.error(
    options.context || 'Application error:',
    error
  );

  if (typeof options.onError === 'function') {
    options.onError(message);
  }

  return message;
}

export async function safelyRun(
  callback,
  options = {}
) {
  try {
    return await callback();
  } catch (error) {
    handleError(error, options);
    return null;
  }
}
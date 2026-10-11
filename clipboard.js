export async function copyText(text) {
  if (typeof text !== 'string' || !text.length) {
    return {
      success: false,
      message: 'Nothing to copy.'
    };
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);

      return {
        success: true,
        message: 'Copied successfully.'
      };
    }

    return {
      success: false,
      message: 'Clipboard is not supported here.'
    };
  } catch {
    return {
      success: false,
      message: 'Could not copy. Please try again.'
    };
  }
}

export async function copyUrl(url) {
  if (typeof url !== 'string') {
    return {
      success: false,
      message: 'Invalid link.'
    };
  }

  try {
    const parsedUrl = new URL(url);

    if (
      !['https:', 'http:'].includes(parsedUrl.protocol)
    ) {
      throw new Error('Unsupported URL protocol.');
    }

    return copyText(parsedUrl.href);
  } catch {
    return {
      success: false,
      message: 'Invalid link.'
    };
  }
}
export function setButtonLoading(
  button,
  loading,
  loadingText = 'Please wait...'
) {
  if (!(button instanceof HTMLButtonElement)) {
    return false;
  }

  if (loading) {
    if (!button.dataset.originalText) {
      button.dataset.originalText =
        button.textContent || '';
    }

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = loadingText;

    return true;
  }

  button.disabled = false;
  button.removeAttribute('aria-busy');

  if (button.dataset.originalText !== undefined) {
    button.textContent = button.dataset.originalText;
    delete button.dataset.originalText;
  }

  return true;
}

export async function runButtonAction(
  button,
  action,
  loadingText = 'Please wait...'
) {
  if (typeof action !== 'function') {
    throw new Error('Action must be a function.');
  }

  if (!setButtonLoading(button, true, loadingText)) {
    return null;
  }

  try {
    return await action();
  } finally {
    setButtonLoading(button, false);
  }
}
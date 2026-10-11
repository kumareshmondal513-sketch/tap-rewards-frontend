export function showLoading(message = 'Loading...') {
  let overlay = document.getElementById('loadingOverlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';

    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '14px',
      background: 'rgba(16, 24, 39, 0.92)',
      color: '#ffffff',
      zIndex: '9999',
      fontFamily: 'Arial, sans-serif'
    });

    const spinner = document.createElement('div');
    spinner.textContent = '⏳';
    spinner.style.fontSize = '42px';

    const text = document.createElement('p');
    text.id = 'loadingMessage';

    overlay.append(spinner, text);
    document.body.appendChild(overlay);
  }

  document.getElementById('loadingMessage').textContent = message;
}

export function hideLoading() {
  document.getElementById('loadingOverlay')?.remove();
}
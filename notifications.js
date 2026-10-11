export function showNotification(message, type = 'info') {
  const allowedTypes = ['info', 'success', 'error'];

  if (!allowedTypes.includes(type)) {
    type = 'info';
  }

  let container = document.getElementById(
    'notificationContainer'
  );

  if (!container) {
    container = document.createElement('div');
    container.id = 'notificationContainer';

    Object.assign(container.style, {
      position: 'fixed',
      top: '16px',
      left: '16px',
      right: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: '10000',
      pointerEvents: 'none'
    });

    document.body.appendChild(container);
  }

  const colors = {
    info: '#334155',
    success: '#166534',
    error: '#991b1b'
  };

  const notice = document.createElement('div');

  notice.textContent = String(message);

  Object.assign(notice.style, {
    padding: '14px 16px',
    borderRadius: '12px',
    background: colors[type],
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    pointerEvents: 'auto'
  });

  container.appendChild(notice);

  const timeoutId = setTimeout(() => {
    notice.remove();

    if (container.childElementCount === 0) {
      container.remove();
    }
  }, 3000);

  return () => {
    clearTimeout(timeoutId);
    notice.remove();

    if (
      container.isConnected &&
      container.childElementCount === 0
    ) {
      container.remove();
    }
  };
}
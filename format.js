export function formatCoins(value) {
  const coins = Number(value);

  if (!Number.isFinite(coins) || coins < 0) {
    return '0';
  }

  return Math.floor(coins).toLocaleString('en-US');
}

export function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDuration(totalSeconds) {
  const seconds = Number(totalSeconds);

  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0s';
  }

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}
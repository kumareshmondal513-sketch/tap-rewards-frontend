export function debounce(callback, delay = 300) {
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function.');
  }

  const wait = Number.isFinite(delay)
    ? Math.max(0, Math.min(delay, 10000))
    : 300;

  let timerId;

  function debounced(...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      callback.apply(this, args);
    }, wait);
  }

  debounced.cancel = function () {
    clearTimeout(timerId);
    timerId = undefined;
  };

  return debounced;
}

export function throttle(callback, interval = 500) {
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function.');
  }

  const wait = Number.isFinite(interval)
    ? Math.max(0, Math.min(interval, 10000))
    : 500;

  let lastRun = 0;

  return function throttled(...args) {
    const now = Date.now();

    if (now - lastRun < wait) {
      return;
    }

    lastRun = now;
    return callback.apply(this, args);
  };
}
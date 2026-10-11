import { apiGet, apiPost } from './apiClient.js';

export async function getEnergyInfo() {
  return apiGet('/api/energy');
}

export async function refillEnergy() {
  return apiPost('/api/energy/refill', {});
}

export function getEnergyPercentage(energy, maxEnergy) {
  const current = Number(energy);
  const maximum = Number(maxEnergy);

  if (
    !Number.isFinite(current) ||
    !Number.isFinite(maximum) ||
    maximum <= 0
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round((current / maximum) * 100))
  );
}

export function formatEnergy(energy, maxEnergy) {
  const current = Number(energy);
  const maximum = Number(maxEnergy);

  if (
    !Number.isSafeInteger(current) ||
    !Number.isSafeInteger(maximum) ||
    current < 0 ||
    maximum < 0
  ) {
    return '0 / 0';
  }

  return `${current.toLocaleString()} / ${maximum.toLocaleString()}`;
}
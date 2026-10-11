import { apiGet, apiPost } from './apiClient.js';

export async function getTasks() {
  return apiGet('/api/tasks');
}

export async function getTaskDetails(taskId) {
  const id = validateTaskId(taskId);

  return apiGet(`/api/tasks/${encodeURIComponent(id)}`);
}

export async function submitTask(taskId, proof = {}) {
  const id = validateTaskId(taskId);

  if (
    proof === null ||
    typeof proof !== 'object' ||
    Array.isArray(proof)
  ) {
    throw new Error('Invalid task proof.');
  }

  return apiPost(
    `/api/tasks/${encodeURIComponent(id)}/submit`,
    proof
  );
}

export async function claimTaskReward(taskId) {
  const id = validateTaskId(taskId);

  return apiPost(
    `/api/tasks/${encodeURIComponent(id)}/claim`,
    {}
  );
}

function validateTaskId(taskId) {
  const id = String(taskId ?? '');

  if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) {
    throw new Error('Invalid task ID.');
  }

  return id;
}
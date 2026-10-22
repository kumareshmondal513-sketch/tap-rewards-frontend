import {database as db} from './firebase.js';

export async function getTasks() {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db.ref('tasks').once('value');

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(([id, task]) => ({
    id,
    ...task
  }));
}

export async function createTask(taskData) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  if (!taskData.title) {
    throw new Error('Task title is required.');
  }

  const taskRef = db.ref('tasks').push();

  const task = {
    title: taskData.title,
    description: taskData.description || '',
    type: taskData.type || 'other',
    url: taskData.url || '',
    reward: Number(taskData.reward || 0),
    verificationCode: taskData.verificationCode || '',
    adUrl: taskData.adUrl || '',
    adDuration: Number(taskData.adDuration || 0),
    enabled: taskData.enabled !== false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await taskRef.set(task);

  return {
    id: taskRef.key,
    ...task
  };
}

export async function updateTask(taskId, updates) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const taskRef = db.ref(`tasks/${taskId}`);

  const snapshot = await taskRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('Task not found.');
  }

  await taskRef.update({
    ...updates,
    updatedAt: Date.now()
  });

  const updated = await taskRef.once('value');

  return {
    id: taskId,
    ...updated.val()
  };
}

export async function deleteTask(taskId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const taskRef = db.ref(`tasks/${taskId}`);

  const snapshot = await taskRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('Task not found.');
  }

  await taskRef.remove();

  return {
    success: true,
    message: 'Task deleted.'
  };
}

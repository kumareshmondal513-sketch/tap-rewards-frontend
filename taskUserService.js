import { db } from './firebase.js';


// ===============================
// GET USER TASK STATUS
// ===============================
export async function getUserTaskStatus(
  telegramId,
  taskId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref(`taskCompletions/${telegramId}/${taskId}`)
    .once('value');

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
}


// ===============================
// CHECK TASK COMPLETED
// ===============================
export async function isTaskCompleted(
  telegramId,
  taskId
) {
  const status = await getUserTaskStatus(
    telegramId,
    taskId
  );

  return Boolean(status?.completed);
}


// ===============================
// COMPLETE TASK
// ===============================
export async function completeTask(
  telegramId,
  taskId,
  verificationCode = ''
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const taskRef = db.ref(`tasks/${taskId}`);
  const userRef = db.ref(`users/${telegramId}`);

  const [taskSnapshot, userSnapshot] =
    await Promise.all([
      taskRef.once('value'),
      userRef.once('value')
    ]);

  if (!taskSnapshot.exists()) {
    throw new Error('Task not found.');
  }

  if (!userSnapshot.exists()) {
    throw new Error('User not found.');
  }

  const task = taskSnapshot.val();
  const user = userSnapshot.val();

  if (task.enabled === false) {
    throw new Error('This task is disabled.');
  }

  const completionRef = db.ref(
    `taskCompletions/${telegramId}/${taskId}`
  );

  const completionSnapshot =
    await completionRef.once('value');

  if (completionSnapshot.exists()) {
    const previous = completionSnapshot.val();

    if (previous.completed) {
      throw new Error(
        'You have already completed this task.'
      );
    }
  }

  // Verification code check
  if (task.verificationCode) {
    if (
      String(verificationCode).trim() !==
      String(task.verificationCode).trim()
    ) {
      throw new Error(
        'Invalid verification code.'
      );
    }
  }

  const reward = Number(task.reward || 0);

  const newCoins =
    Number(user.coins || 0) + reward;

  const newTotalEarned =
    Number(user.totalEarned || 0) + reward;

  const now = Date.now();

  await userRef.update({
    coins: newCoins,
    totalEarned: newTotalEarned,
    updatedAt: now
  });

  await completionRef.set({
    completed: true,
    reward,
    completedAt: now
  });

  const transactionId =
    `${now}_${Math.random().toString(36).slice(2)}`;

  await db.ref(
    `transactions/${telegramId}/${transactionId}`
  ).set({
    type: 'task_reward',
    taskId,
    amount: reward,
    createdAt: now
  });

  return {
    success: true,
    taskId,
    reward,
    coins: newCoins,
    adUrl: task.adUrl || '',
    adDuration: Number(task.adDuration || 0)
  };
}


// ===============================
// GET USER TASK LIST
// ===============================
export async function getUserTasks(
  telegramId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const tasksSnapshot =
    await db.ref('tasks').once('value');

  if (!tasksSnapshot.exists()) {
    return [];
  }

  const completionSnapshot =
    await db
      .ref(`taskCompletions/${telegramId}`)
      .once('value');

  const tasksData = tasksSnapshot.val();
  const completionData =
    completionSnapshot.exists()
      ? completionSnapshot.val()
      : {};

  return Object.entries(tasksData)
    .filter(([, task]) => task.enabled !== false)
    .map(([id, task]) => ({
      id,
      ...task,
      completed: Boolean(
        completionData[id]?.completed
      )
    }));
}
import { db } from './firebase.js';

async function countRecords(path) {
  const snapshot = await db.ref(path).once('value');

  if (!snapshot.exists()) {
    return 0;
  }

  const data = snapshot.val();

  return Object.keys(data).length;
}

export async function getAdminDashboard() {
  const [
    usersSnapshot,
    tasksCount,
    withdrawalsCount,
    pendingWithdrawalsCount
  ] = await Promise.all([
    db.ref('users').once('value'),
    countRecords('tasks'),
    countRecords('withdrawals'),
    countPendingWithdrawals()
  ]);

  const users = usersSnapshot.exists()
    ? usersSnapshot.val()
    : {};

  let totalCoins = 0;
  let totalUsers = 0;
  let suspendedUsers = 0;

  for (const user of Object.values(users)) {
    if (!user || typeof user !== 'object') {
      continue;
    }

    totalUsers++;

    totalCoins += Math.max(
      0,
      Number(user.coins) || 0
    );

    if (user.status === 'suspended') {
      suspendedUsers++;
    }
  }

  return {
    totalUsers,
    suspendedUsers,
    totalCoins,
    totalTasks: tasksCount,
    totalWithdrawals: withdrawalsCount,
    pendingWithdrawals: pendingWithdrawalsCount,
    generatedAt: Date.now()
  };
}

async function countPendingWithdrawals() {
  const snapshot = await db
    .ref('withdrawals')
    .orderByChild('status')
    .equalTo('pending')
    .once('value');

  if (!snapshot.exists()) {
    return 0;
  }

  return Object.keys(snapshot.val()).length;
}
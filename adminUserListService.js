import { db } from './firebase.js';

const usersRef = db.ref('users');

// ইউজারদের তালিকা সংগ্রহ
export async function getAdminUserList({
  limit = 50,
  status = ''
} = {}) {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 50, 1),
    100
  );

  const snapshot = await usersRef.once('value');

  if (!snapshot.exists()) {
    return {
      total: 0,
      users: []
    };
  }

  const data = snapshot.val();

  let users = Object.entries(data)
    .filter(([, user]) => {
      return user && typeof user === 'object';
    })
    .map(([userId, user]) => ({
      userId,
      firstName: user.firstName || '',
      username: user.username || '',
      status: user.status || 'active',
      coins: Math.max(
        0,
        Number(user.coins) || 0
      ),
      country: user.country || 'Unknown',
      lastActiveAt: Number(
        user.lastActiveAt || 0
      )
    }));

  if (status) {
    users = users.filter(
      (user) => user.status === status
    );
  }

  users.sort(
    (a, b) => b.lastActiveAt - a.lastActiveAt
  );

  return {
    total: users.length,
    users: users.slice(0, safeLimit)
  };
}
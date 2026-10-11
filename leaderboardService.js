import { db } from './firebase.js';

const usersRef = db.ref('users');

// কয়েন অনুযায়ী সেরা ইউজারদের তালিকা
export async function getLeaderboard(limit = 10) {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  const snapshot = await usersRef.once('value');

  if (!snapshot.exists()) {
    return {
      total: 0,
      leaderboard: []
    };
  }

  const data = snapshot.val();

  const leaderboard = Object.entries(data)
    .filter(([, user]) => {
      return (
        user &&
        typeof user === 'object' &&
        user.status !== 'suspended'
      );
    })
    .map(([userId, user]) => ({
      userId,
      firstName: user.firstName || 'Player',
      username: user.username || '',
      coins: Math.max(
        0,
        Number(user.coins) || 0
      ),
      level: Math.max(
        1,
        Number(user.level) || 1
      )
    }))
    .filter((user) => {
      return Number.isSafeInteger(user.coins);
    })
    .sort((a, b) => {
      return (
        b.coins - a.coins ||
        a.userId.localeCompare(b.userId)
      );
    });

  return {
    total: leaderboard.length,
    leaderboard: leaderboard
      .slice(0, safeLimit)
      .map((user, index) => ({
        rank: index + 1,
        ...user
      }))
  };
}
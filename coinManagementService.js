import { db } from './firebase.js';

const usersRef = db.ref('users');
const coinLogsRef = db.ref('coinLogs');

// ইউজারের কয়েন পরিবর্তন
export async function adjustUserCoins({
  userId,
  adminId,
  amount,
  reason
}) {
  if (!userId || !adminId || !reason) {
    throw new Error(
      'userId, adminId এবং কারণ দিতে হবে'
    );
  }

  const change = Number(amount);

  if (
    !Number.isSafeInteger(change) ||
    change === 0
  ) {
    throw new Error(
      'কয়েনের পরিমাণ শূন্য নয় এমন পূর্ণসংখ্যা হতে হবে'
    );
  }

  const userRef = usersRef.child(String(userId));
  const logRef = coinLogsRef.push();

  let newBalance = null;

  // ব্যালেন্স ও লগ একই সঙ্গে সংরক্ষণ
  const result = await userRef.transaction(
    (user) => {
      if (!user || typeof user !== 'object') {
        return;
      }

      const currentCoins = Number(user.coins || 0);

      if (
        !Number.isSafeInteger(currentCoins) ||
        currentCoins < 0
      ) {
        return;
      }

      const nextBalance = currentCoins + change;

      if (
        !Number.isSafeInteger(nextBalance) ||
        nextBalance < 0
      ) {
        return;
      }

      newBalance = nextBalance;

      return {
        ...user,
        coins: nextBalance
      };
    }
  );

  if (!result.committed) {
    throw new Error(
      'কয়েন পরিবর্তন করা যায়নি; ব্যালেন্স যাচাই করুন'
    );
  }

  const logData = {
    userId: String(userId),
    adminId: String(adminId),
    amount: change,
    reason: String(reason),
    balanceAfter: newBalance,
    createdAt: Date.now()
  };

  try {
    await logRef.set(logData);
  } catch (error) {
    console.error(
      'Coin log save failed:',
      error.message
    );

    throw new Error(
      'কয়েন পরিবর্তিত হয়েছে, কিন্তু লগ সংরক্ষণ ব্যর্থ হয়েছে'
    );
  }

  return {
    success: true,
    userId: String(userId),
    changedBy: change,
    newBalance
  };
}
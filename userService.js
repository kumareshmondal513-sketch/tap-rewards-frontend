import { db } from './firebase.js';

const DEFAULT_USER = {
  coins: 0,
  energy: 1000,
  maxEnergy: 1000,
  level: 1,
  xp: 0,
  referralCount: 0,
  totalEarned: 0,
  totalTaps: 0,
  isActive: true,
  isSuspended: false
};

export async function getUser(telegramId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const ref = db.ref(`users/${telegramId}`);
  const snapshot = await ref.once('value');

  return snapshot.exists() ? snapshot.val() : null;
}

export async function createUser(telegramUser) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const telegramId = String(telegramUser.id);
  const ref = db.ref(`users/${telegramId}`);
  const snapshot = await ref.once('value');

  if (snapshot.exists()) {
    return snapshot.val();
  }

  const user = {
    ...DEFAULT_USER,

    telegramId,

    firstName: telegramUser.first_name || '',
    lastName: telegramUser.last_name || '',
    username: telegramUser.username || '',

    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await ref.set(user);

  return user;
}

export async function updateUser(telegramId, updates) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const ref = db.ref(`users/${telegramId}`);

  await ref.update({
    ...updates,
    updatedAt: Date.now()
  });

  const snapshot = await ref.once('value');

  return snapshot.val();
}

export async function addCoins(
  telegramId,
  amount,
  reason = 'reward'
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid coin amount.');
  }

  const ref = db.ref(`users/${telegramId}`);

  const result = await ref.transaction((user) => {
    if (!user) {
      return user;
    }

    user.coins = Number(user.coins || 0) + amount;
    user.totalEarned =
      Number(user.totalEarned || 0) + amount;
    user.updatedAt = Date.now();

    return user;
  });

  if (!result.committed) {
    throw new Error('Coin update failed.');
  }

  const transactionId =
    `${Date.now()}_${Math.random().toString(36).slice(2)}`;

  await db.ref(
    `transactions/${telegramId}/${transactionId}`
  ).set({
    type: 'credit',
    amount,
    reason,
    createdAt: Date.now()
  });

  return result.snapshot.val();
}

export async function addTap(telegramId, amount = 1) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid tap amount.');
  }

  const ref = db.ref(`users/${telegramId}`);

  const result = await ref.transaction((user) => {
    if (!user) {
      return user;
    }

    const currentEnergy = Number(user.energy || 0);

    if (currentEnergy < amount) {
      return;
    }

    user.energy = currentEnergy - amount;
    user.coins = Number(user.coins || 0) + amount;
    user.totalEarned =
      Number(user.totalEarned || 0) + amount;
    user.totalTaps =
      Number(user.totalTaps || 0) + amount;
    user.xp = Number(user.xp || 0) + amount;
    user.updatedAt = Date.now();

    return user;
  });

  if (!result.committed) {
    throw new Error('Not enough energy or tap failed.');
  }

  return result.snapshot.val();
}
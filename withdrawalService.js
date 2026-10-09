import { db } from './firebase.js';


// ===============================
// DEFAULT WITHDRAWAL SETTINGS
// ===============================
const DEFAULT_MIN_WITHDRAWAL = 5000000;


// ===============================
// GET WITHDRAWAL SETTINGS
// ===============================
export async function getWithdrawalSettings() {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref('settings/withdrawal')
    .once('value');

  if (!snapshot.exists()) {
    return {
      enabled: false,
      minimumCoins: DEFAULT_MIN_WITHDRAWAL,
      message:
        'Withdrawal is currently unavailable.'
    };
  }

  return snapshot.val();
}


// ===============================
// UPDATE WITHDRAWAL SETTINGS
// ===============================
export async function updateWithdrawalSettings(
  settings
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const current =
    await getWithdrawalSettings();

  const updated = {
    ...current,
    ...settings,
    updatedAt: Date.now()
  };

  await db
    .ref('settings/withdrawal')
    .set(updated);

  return updated;
}


// ===============================
// CREATE WITHDRAWAL REQUEST
// ===============================
export async function createWithdrawal(
  telegramId,
  withdrawalData
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const userRef =
    db.ref(`users/${telegramId}`);

  const userSnapshot =
    await userRef.once('value');

  if (!userSnapshot.exists()) {
    throw new Error('User not found.');
  }

  const user = userSnapshot.val();

  const settings =
    await getWithdrawalSettings();

  if (settings.enabled !== true) {
    throw new Error(
      settings.message ||
      'Withdrawal is currently unavailable.'
    );
  }

  const amount =
    Number(withdrawalData.amount || 0);

  const minimumCoins =
    Number(
      settings.minimumCoins ||
      DEFAULT_MIN_WITHDRAWAL
    );

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      'Invalid withdrawal amount.'
    );
  }

  if (amount < minimumCoins) {
    throw new Error(
      `Minimum withdrawal is ${minimumCoins} coins.`
    );
  }

  const currentCoins =
    Number(user.coins || 0);

  if (currentCoins < amount) {
    throw new Error(
      'Insufficient coin balance.'
    );
  }

  const method =
    withdrawalData.method || '';

  const accountNumber =
    withdrawalData.accountNumber || '';

  if (!method) {
    throw new Error(
      'Withdrawal method is required.'
    );
  }

  if (!accountNumber) {
    throw new Error(
      'Account number is required.'
    );
  }

  const withdrawalRef =
    db.ref('withdrawals').push();

  const withdrawalId =
    withdrawalRef.key;

  const now = Date.now();

  const withdrawal = {
    id: withdrawalId,
    telegramId: String(telegramId),
    amount,
    method,
    accountNumber,
    accountName:
      withdrawalData.accountName || '',
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  // Reserve/deduct coins
  await userRef.update({
    coins: currentCoins - amount,
    updatedAt: now
  });

  await withdrawalRef.set(
    withdrawal
  );

  await db.ref(
    `transactions/${telegramId}/${withdrawalId}`
  ).set({
    type: 'withdrawal',
    amount: -amount,
    status: 'pending',
    createdAt: now
  });

  return withdrawal;
}


// ===============================
// GET USER WITHDRAWALS
// ===============================
export async function getUserWithdrawals(
  telegramId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot =
    await db
      .ref('withdrawals')
      .orderByChild('telegramId')
      .equalTo(String(telegramId))
      .once('value');

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(
    ([id, withdrawal]) => ({
      id,
      ...withdrawal
    })
  );
}


// ===============================
// GET ALL WITHDRAWALS
// ===============================
export async function getAllWithdrawals() {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot =
    await db.ref('withdrawals').
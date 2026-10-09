import { db } from './firebase.js';


// ===============================
// GET USER TRANSACTIONS
// ===============================
export async function getUserTransactions(
  telegramId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref(`transactions/${telegramId}`)
    .once('value');

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data)
    .map(([id, transaction]) => ({
      id,
      ...transaction
    }))
    .sort(
      (a, b) =>
        Number(b.createdAt || 0) -
        Number(a.createdAt || 0)
    );
}


// ===============================
// GET ONE TRANSACTION
// ===============================
export async function getTransaction(
  telegramId,
  transactionId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref(
      `transactions/${telegramId}/${transactionId}`
    )
    .once('value');

  if (!snapshot.exists()) {
    throw new Error(
      'Transaction not found.'
    );
  }

  return {
    id: transactionId,
    ...snapshot.val()
  };
}


// ===============================
// CREATE TRANSACTION
// ===============================
export async function createTransaction(
  telegramId,
  transactionData
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const transactionRef = db
    .ref(`transactions/${telegramId}`)
    .push();

  const transaction = {
    type: transactionData.type || 'other',
    amount: Number(
      transactionData.amount || 0
    ),
    reason:
      transactionData.reason || '',
    status:
      transactionData.status || 'completed',
    taskId:
      transactionData.taskId || null,
    createdAt: Date.now()
  };

  await transactionRef.set(
    transaction
  );

  return {
    id: transactionRef.key,
    ...transaction
  };
}
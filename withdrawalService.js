import { clientDatabase } from './firebaseClient.js';

const DEFAULT_MIN_WITHDRAWAL = 5000000;

function getDatabase() {
  if (!database) {
    throw new Error("Firebase database is not configured.");
  }

  return database;
}

function validateUserId(userId) {
  if (
    typeof userId !== "string" ||
    !userId.trim() ||
    userId.includes("/") ||
    userId.includes(".") ||
    userId.includes("#") ||
    userId.includes("$") ||
    userId.includes("[") ||
    userId.includes("]")
  ) {
    throw new Error("Invalid user ID.");
  }
}

function validateAmount(amount) {
  const value = Number(amount);

  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error("Withdrawal amount must be a positive integer.");
  }

  return value;
}

export async function createWithdrawal({
  userId,
  amount,
  method,
  accountNumber
}) {
  validateUserId(userId);

  const value = validateAmount(amount);
  const normalizedMethod = String(method || "").trim().toLowerCase();
  const normalizedAccount = String(accountNumber || "").trim();

  const allowedMethods = [
    "bkash",
    "nagad",
    "rocket"
  ];

  if (!allowedMethods.includes(normalizedMethod)) {
    throw new Error("Unsupported withdrawal method.");
  }

  if (
    normalizedAccount.length < 5 ||
    normalizedAccount.length > 40
  ) {
    throw new Error("Invalid withdrawal account.");
  }

  const db = getDatabase();
  const settingsRef = db.ref("settings");
  const userRef = db.ref(`users/${userId}`);
  const requestsRef = db.ref("withdrawals");

  const [settingsSnapshot, userSnapshot] = await Promise.all([
    settingsRef.get(),
    userRef.get()
  ]);

  const settings = settingsSnapshot.val() || {};
  const user = userSnapshot.val();

  if (settings.maintenanceMode === true) {
    throw new Error("Withdrawals are temporarily unavailable.");
  }

  if (settings.withdrawalsEnabled !== true) {
    throw new Error("Withdrawals are currently disabled.");
  }

  const minimum = Number(
    settings.minWithdrawal ?? DEFAULT_MIN_WITHDRAWAL
  );

  if (value < minimum) {
    throw new Error(`Minimum withdrawal is ${minimum} coins.`);
  }

  if (!user) {
    throw new Error("User account was not found.");
  }

  if (user.suspended === true || user.banned === true) {
    throw new Error("This account cannot withdraw.");
  }

  if (user.verified !== true) {
    throw new Error("Account verification is required.");
  }

  const balance = Number(user.balance ?? user.coins ?? 0);

  if (!Number.isSafeInteger(balance) || balance < value) {
    throw new Error("Insufficient balance.");
  }

  const requestRef = requestsRef.push();
  const requestId = requestRef.key;

  if (!requestId) {
    throw new Error("Could not create withdrawal request.");
  }

  const transactionResult = await userRef.transaction((currentUser) => {
    if (!currentUser) return;

    if (
      currentUser.suspended === true ||
      currentUser.banned === true ||
      currentUser.verified !== true
    ) {
      return;
    }

    const currentBalance = Number(
      currentUser.balance ?? currentUser.coins ?? 0
    );

    if (
      !Number.isSafeInteger(currentBalance) ||
      currentBalance < value
    ) {
      return;
    }

    if (currentUser.balance !== undefined) {
      currentUser.balance = currentBalance - value;
    } else {
      currentUser.coins = currentBalance - value;
    }

    return currentUser;
  });

  if (!transactionResult.committed) {
    throw new Error(
      "Withdrawal could not be processed. Check your balance and account status."
    );
  }

  const request = {
    id: requestId,
    userId,
    amount: value,
    method: normalizedMethod,
    accountNumber: normalizedAccount,
    status: "pending",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  try {
    await requestRef.set(request);
  } catch (error) {
    // Restore the balance if saving the request fails.
    await userRef.transaction((currentUser) => {
      if (!currentUser) return;

      if (currentUser.balance !== undefined) {
        currentUser.balance = Number(currentUser.balance || 0) + value;
      } else {
        currentUser.coins = Number(currentUser.coins || 0) + value;
      }

      return currentUser;
    });

    throw new Error("Could not save withdrawal request.");
  }

  return {
    success: true,
    message: "Withdrawal request submitted for review.",
    withdrawal: request
  };
}

export async function getAllWithdrawals(userId) {
  validateUserId(userId);

  const snapshot = await getDatabase()
    .ref("withdrawals")
    .orderByChild("userId")
    .equalTo(userId)
    .get();

  const requests = [];

  snapshot.forEach((child) => {
    requests.push(child.val());
  });

  return requests.sort(
    (a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)
  );
}

export async function getWithdrawalById(requestId) {
  if (
    typeof requestId !== "string" ||
    !requestId.trim() ||
    requestId.includes("/") ||
    requestId.includes(".") ||
    requestId.includes("#") ||
    requestId.includes("$") ||
    requestId.includes("[") ||
    requestId.includes("]")
  ) {
    throw new Error("Invalid withdrawal request ID.");
  }

  const snapshot = await getDatabase()
    .ref(`withdrawals/${requestId}`)
    .get();

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
}
export async function getWithdrawalSettings() { const db = getDatabase(); const snapshot = await db.ref('settings').get(); return snapshot.val(); }
export async function updateWithdrawalSettings(settings) { const db = getDatabase(); await db.ref('settings').update(settings); }

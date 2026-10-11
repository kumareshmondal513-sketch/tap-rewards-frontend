import { database } from "./firebase.js";

const DAILY_REWARD = 100;
const DAY_MS = 24 * 60 * 60 * 1000;

function getUsersRef() {
  if (!database) {
    throw new Error("Firebase database is not configured");
  }

  return database.ref("users");
}

function getUtcDay(timestamp) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export async function claimDailyReward(userId) {
  const userRef = getUsersRef().child(String(userId));
  const now = Date.now();
  const today = getUtcDay(now);

  const result = await userRef.transaction((user) => {
    if (!user) {
      return;
    }

    const lastClaimAt = Number(user.dailyRewardClaimedAt) || 0;
    const lastClaimDay = user.dailyRewardDay || "";

    if (lastClaimDay === today) {
      return;
    }

    if (lastClaimAt > 0 && now - lastClaimAt < DAY_MS) {
      return;
    }

    user.coins = (Number(user.coins) || 0) + DAILY_REWARD;
    user.dailyRewardClaimedAt = now;
    user.dailyRewardDay = today;
    user.updatedAt = now;

    return user;
  });

  if (!result.committed) {
    const snapshot = await userRef.get();

    if (!snapshot.exists()) {
      throw new Error("User not found");
    }

    throw new Error("Daily reward already claimed");
  }

  const user = result.snapshot.val();

  return {
    userId: String(userId),
    reward: DAILY_REWARD,
    balance: Number(user.coins) || 0,
    claimedAt: user.dailyRewardClaimedAt,
    nextClaimAvailableAt:
      Number(user.dailyRewardClaimedAt) + DAY_MS
  };
}

export async function getDailyRewardStatus(userId) {
  const snapshot = await getUsersRef()
    .child(String(userId))
    .get();

  if (!snapshot.exists()) {
    throw new Error("User not found");
  }

  const user = snapshot.val();
  const now = Date.now();
  const lastClaimAt = Number(user.dailyRewardClaimedAt) || 0;
  const lastClaimDay = user.dailyRewardDay || "";
  const today = getUtcDay(now);

  const claimedToday = lastClaimDay === today;
  const nextClaimAvailableAt = lastClaimAt + DAY_MS;

  return {
    userId: String(userId),
    reward: DAILY_REWARD,
    claimedToday,
    canClaim:
      !claimedToday && now >= nextClaimAvailableAt,
    nextClaimAvailableAt:
      lastClaimAt > 0 ? nextClaimAvailableAt : now
  };
}

export { DAILY_REWARD };
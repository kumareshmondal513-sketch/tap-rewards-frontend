import { database } from "./firebase.js";

const MAX_LEVEL = 100;

function getUsersRef() {
  if (!database) {
    throw new Error("Firebase database is not configured");
  }

  return database.ref("users");
}

export function getXpRequired(level) {
  const currentLevel = Math.max(1, Number(level) || 1);
  return currentLevel * 100;
}

export function calculateLevel(xp) {
  let remainingXp = Math.max(0, Number(xp) || 0);
  let level = 1;

  while (
    level < MAX_LEVEL &&
    remainingXp >= getXpRequired(level)
  ) {
    remainingXp -= getXpRequired(level);
    level++;
  }

  return {
    level,
    xp: remainingXp,
    xpRequired: getXpRequired(level)
  };
}

export async function getUserLevel(userId) {
  const snapshot = await getUsersRef()
    .child(String(userId))
    .get();

  if (!snapshot.exists()) {
    throw new Error("User not found");
  }

  const user = snapshot.val();

  return {
    userId: String(userId),
    level: Number(user.level) || 1,
    xp: Number(user.xp) || 0,
    xpRequired: getXpRequired(user.level)
  };
}

export async function addXp(userId, amount) {
  const xpAmount = Number(amount);

  if (
    !Number.isSafeInteger(xpAmount) ||
    xpAmount <= 0 ||
    xpAmount > 100000
  ) {
    throw new Error("Invalid XP amount");
  }

  const userRef = getUsersRef().child(String(userId));

  const result = await userRef.transaction((user) => {
    if (!user) {
      return;
    }

    const totalXp = (Number(user.xp) || 0) + xpAmount;
    const calculated = calculateLevel(totalXp);

    user.xp = calculated.xp;
    user.level = calculated.level;
    user.updatedAt = Date.now();

    return user;
  });

  if (!result.committed) {
    throw new Error("User not found");
  }

  const user = result.snapshot.val();

  return {
    userId: String(userId),
    level: user.level,
    xp: user.xp,
    xpRequired: getXpRequired(user.level)
  };
}

export { MAX_LEVEL };
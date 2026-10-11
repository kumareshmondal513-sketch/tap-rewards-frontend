import { database } from "./firebase.js";

function getUsersRef() {
  if (!database) {
    throw new Error("Firebase database is not configured");
  }

  return database.ref("users");
}

export async function getUser(userId) {
  const snapshot = await getUsersRef()
    .child(String(userId))
    .get();

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
}

export async function createUser(userId, data = {}) {
  const usersRef = getUsersRef();
  const userRef = usersRef.child(String(userId));
  const snapshot = await userRef.get();

  if (snapshot.exists()) {
    return snapshot.val();
  }

  const user = {
    id: String(userId),
    username: data.username || "",
    firstName: data.firstName || "",
    coins: 0,
    level: 1,
    xp: 0,
    energy: 1000,
    maxEnergy: 1000,
    referrals: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await userRef.set(user);

  return user;
}

export async function updateUser(userId, updates = {}) {
  const userRef = getUsersRef().child(String(userId));
  const snapshot = await userRef.get();

  if (!snapshot.exists()) {
    throw new Error("User not found");
  }

  const safeUpdates = {
    ...updates,
    updatedAt: Date.now()
  };

  delete safeUpdates.id;
  delete safeUpdates.coins;
  delete safeUpdates.createdAt;

  await userRef.update(safeUpdates);

  const updatedSnapshot = await userRef.get();

  return updatedSnapshot.val();
}

export async function getUserBalance(userId) {
  const user = await getUser(userId);

  if (!user) {
    return 0;
  }

  return Number(user.coins) || 0;
}
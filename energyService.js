import { database } from "./firebase.js";

const DEFAULT_MAX_ENERGY = 1000;
const REGEN_INTERVAL_MS = 5000;
const ENERGY_PER_INTERVAL = 1;

function getUsersRef() {
  if (!database) {
    throw new Error("Firebase database is not configured");
  }

  return database.ref("users");
}

function calculateEnergy(user) {
  const maxEnergy = Math.max(
    1,
    Number(user.maxEnergy) || DEFAULT_MAX_ENERGY
  );

  const currentEnergy = Math.max(
    0,
    Math.min(maxEnergy, Number(user.energy) || 0)
  );

  const lastUpdate = Number(user.energyUpdatedAt) || Date.now();
  const elapsed = Math.max(0, Date.now() - lastUpdate);
  const intervals = Math.floor(elapsed / REGEN_INTERVAL_MS);

  const energy = Math.min(
    maxEnergy,
    currentEnergy + intervals * ENERGY_PER_INTERVAL
  );

  const energyUpdatedAt =
    energy >= maxEnergy
      ? Date.now()
      : lastUpdate + intervals * REGEN_INTERVAL_MS;

  return {
    energy,
    maxEnergy,
    energyUpdatedAt
  };
}

export async function getEnergy(userId) {
  const userRef = getUsersRef().child(String(userId));
  const snapshot = await userRef.get();

  if (!snapshot.exists()) {
    throw new Error("User not found");
  }

  const user = snapshot.val();
  const result = calculateEnergy(user);

  await userRef.update(result);

  return {
    userId: String(userId),
    ...result
  };
}

export async function refillEnergy(userId) {
  const userRef = getUsersRef().child(String(userId));

  const transaction = await userRef.transaction((user) => {
    if (!user) {
      return;
    }

    const maxEnergy = Math.max(
      1,
      Number(user.maxEnergy) || DEFAULT_MAX_ENERGY
    );

    user.energy = maxEnergy;
    user.maxEnergy = maxEnergy;
    user.energyUpdatedAt = Date.now();
    user.updatedAt = Date.now();

    return user;
  });

  if (!transaction.committed) {
    throw new Error("User not found");
  }

  const user = transaction.snapshot.val();

  return {
    userId: String(userId),
    energy: user.energy,
    maxEnergy: user.maxEnergy
  };
}

export { DEFAULT_MAX_ENERGY, REGEN_INTERVAL_MS };
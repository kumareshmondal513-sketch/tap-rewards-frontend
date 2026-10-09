import { db } from './firebase.js';


// ===============================
// DEFAULT SETTINGS
// ===============================
const DEFAULT_SETTINGS = {
  appName: 'Tap Rewards',
  maintenanceMode: false,

  withdrawal: {
    enabled: false,
    minimumCoins: 5000000
  },

  referral: {
    enabled: true,
    maxTeamSize: 200,
    reward: 100
  },

  dailyReward: {
    enabled: true,
    amount: 500
  },

  tap: {
    rewardPerTap: 1,
    energyPerTap: 1
  },

  energy: {
    defaultMax: 1000,
    regenPerSecond: 1
  }
};


// ===============================
// GET ALL SETTINGS
// ===============================
export async function getSettings() {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref('settings')
    .once('value');

  if (!snapshot.exists()) {
    return DEFAULT_SETTINGS;
  }

  return {
    ...DEFAULT_SETTINGS,
    ...snapshot.val()
  };
}


// ===============================
// GET ONE SETTING GROUP
// ===============================
export async function getSettingGroup(
  group
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref(`settings/${group}`)
    .once('value');

  if (!snapshot.exists()) {
    return DEFAULT_SETTINGS[group] || null;
  }

  return snapshot.val();
}


// ===============================
// UPDATE SETTINGS
// ===============================
export async function updateSettings(
  updates
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const current =
    await getSettings();

  const updated = {
    ...current,
    ...updates,
    updatedAt: Date.now()
  };

  await db
    .ref('settings')
    .set(updated);

  return updated;
}


// ===============================
// UPDATE ONE SETTING GROUP
// ===============================
export async function updateSettingGroup(
  group,
  updates
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  if (!group) {
    throw new Error(
      'Setting group is required.'
    );
  }

  const current =
    await getSettingGroup(group);

  const updated = {
    ...(current || {}),
    ...updates,
    updatedAt: Date.now()
  };

  await db
    .ref(`settings/${group}`)
    .set(updated);

  return updated;
}


// ===============================
// SET MAINTENANCE MODE
// ===============================
export async function setMaintenanceMode(
  enabled
) {
  return updateSettingGroup(
    'system',
    {
      maintenanceMode:
        Boolean(enabled)
    }
  );
}


// ===============================
// CHECK MAINTENANCE MODE
// ===============================
export async function isMaintenanceMode() {
  const system =
    await getSettingGroup('system');

  return Boolean(
    system?.maintenanceMode
  );
}
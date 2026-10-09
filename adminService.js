import { db } from './firebase.js';
import config from './config.js';


// ===============================
// CHECK MAIN ADMIN
// ===============================
export function isMainAdmin(telegramId) {
  return (
    String(telegramId) ===
    String(config.telegram.adminId)
  );
}


// ===============================
// GET ADMIN
// ===============================
export async function getAdmin(telegramId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref(`admins/${telegramId}`)
    .once('value');

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
}


// ===============================
// CHECK ADMIN ACCESS
// ===============================
export async function isAdmin(telegramId) {
  if (isMainAdmin(telegramId)) {
    return true;
  }

  const admin = await getAdmin(
    String(telegramId)
  );

  return Boolean(
    admin &&
    admin.active !== false
  );
}


// ===============================
// CREATE SUB-ADMIN
// ===============================
export async function createAdmin(
  telegramId,
  adminData = {}
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  if (!telegramId) {
    throw new Error(
      'Telegram ID is required.'
    );
  }

  const id = String(telegramId);

  if (isMainAdmin(id)) {
    throw new Error(
      'Main Admin cannot be added as a Sub-Admin.'
    );
  }

  const adminRef = db.ref(`admins/${id}`);

  const snapshot =
    await adminRef.once('value');

  if (snapshot.exists()) {
    throw new Error(
      'This user is already an admin.'
    );
  }

  const admin = {
    telegramId: id,
    name: adminData.name || '',
    username: adminData.username || '',
    role: adminData.role || 'sub_admin',
    active: true,
    permissions:
      adminData.permissions || {
        users: true,
        tasks: true,
        rewards: true,
        ads: true,
        withdrawals: true,
        settings: false
      },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await adminRef.set(admin);

  return admin;
}


// ===============================
// UPDATE ADMIN
// ===============================
export async function updateAdmin(
  telegramId,
  updates
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const id = String(telegramId);

  if (isMainAdmin(id)) {
    throw new Error(
      'Main Admin cannot be modified here.'
    );
  }

  const adminRef = db.ref(`admins/${id}`);

  const snapshot =
    await adminRef.once('value');

  if (!snapshot.exists()) {
    throw new Error(
      'Admin not found.'
    );
  }

  await adminRef.update({
    ...updates,
    updatedAt: Date.now()
  });

  const updated =
    await adminRef.once('value');

  return updated.val();
}


// ===============================
// SUSPEND ADMIN
// ===============================
export async function suspendAdmin(
  telegramId
) {
  return updateAdmin(
    String(telegramId),
    {
      active: false
    }
  );
}


// ===============================
// ACTIVATE ADMIN
// ===============================
export async function activateAdmin(
  telegramId
) {
  return updateAdmin(
    String(telegramId),
    {
      active: true
    }
  );
}


// ===============================
// REMOVE SUB-ADMIN
// ===============================
export async function removeAdmin(
  telegramId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const id = String(telegramId);

  if (isMainAdmin(id)) {
    throw new Error(
      'Main Admin cannot be removed.'
    );
  }

  const adminRef = db.ref(`admins/${id}`);

  const snapshot =
    await adminRef.once('value');

  if (!snapshot.exists()) {
    throw new Error(
      'Admin not found.'
    );
  }

  await adminRef.remove();

  return {
    success: true,
    message: 'Sub-Admin removed successfully.'
  };
}


// ===============================
// GET ALL ADMINS
// ===============================
export async function getAllAdmins() {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot =
    await db.ref('admins').once('value');

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(
    ([id, admin]) => ({
      id,
      ...admin
    })
  );
}


// ===============================
// GET ADMIN PERMISSIONS
// ===============================
export async function getAdminPermissions(
  telegramId
) {
  if (isMainAdmin(telegramId)) {
    return {
      users: true,
      tasks: true,
      rewards: true,
      ads: true,
      withdrawals: true,
      settings: true,
      admins: true
    };
  }

  const admin = await getAdmin(
    String(telegramId)
  );

  if (
    !admin ||
    admin.active === false
  ) {
    return {};
  }

  return admin.permissions || {};
}
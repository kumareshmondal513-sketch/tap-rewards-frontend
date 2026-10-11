import { db } from './firebase.js';

const adminLogsRef = db.ref('adminLogs');

// অ্যাডমিনের কাজ লগ করা
export async function createAdminLog({
  adminId,
  action,
  details = {}
}) {
  if (!adminId || !action) {
    throw new Error(
      'adminId এবং action দিতে হবে'
    );
  }

  const logRef = adminLogsRef.push();

  const logData = {
    adminId: String(adminId),
    action: String(action),
    details,
    createdAt: Date.now()
  };

  await logRef.set(logData);

  return {
    success: true,
    logId: logRef.key,
    log: logData
  };
}

// সর্বশেষ অ্যাডমিন লগ সংগ্রহ করা
export async function getAdminLogs(limit = 50) {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 50, 1),
    100
  );

  const snapshot = await adminLogsRef
    .orderByChild('createdAt')
    .limitToLast(safeLimit)
    .once('value');

  if (!snapshot.exists()) {
    return [];
  }

  const logs = [];

  snapshot.forEach((child) => {
    logs.push({
      logId: child.key,
      ...child.val()
    });
  });

  return logs.reverse();
}

// নির্দিষ্ট অ্যাডমিনের লগ সংগ্রহ করা
export async function getAdminLogsByUser(
  adminId,
  limit = 50
) {
  if (!adminId) {
    throw new Error('adminId দিতে হবে');
  }

  const safeLimit = Math.min(
    Math.max(Number(limit) || 50, 1),
    100
  );

  const snapshot = await adminLogsRef
    .orderByChild('adminId')
    .equalTo(String(adminId))
    .limitToLast(safeLimit)
    .once('value');

  if (!snapshot.exists()) {
    return [];
  }

  const logs = [];

  snapshot.forEach((child) => {
    logs.push({
      logId: child.key,
      ...child.val()
    });
  });

  return logs.reverse();
}
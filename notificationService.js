import { db } from './firebase.js';


// ===============================
// GET ALL NOTIFICATIONS
// ===============================
export async function getNotifications() {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref('notifications')
    .once('value');

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data)
    .map(([id, notification]) => ({
      id,
      ...notification
    }))
    .sort(
      (a, b) =>
        Number(b.createdAt || 0) -
        Number(a.createdAt || 0)
    );
}


// ===============================
// GET ONE NOTIFICATION
// ===============================
export async function getNotification(
  notificationId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref(`notifications/${notificationId}`)
    .once('value');

  if (!snapshot.exists()) {
    throw new Error('Notification not found.');
  }

  return {
    id: notificationId,
    ...snapshot.val()
  };
}


// ===============================
// CREATE NOTIFICATION
// ===============================
export async function createNotification(
  notificationData
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const title =
    notificationData.title || '';

  const message =
    notificationData.message || '';

  if (!title) {
    throw new Error(
      'Notification title is required.'
    );
  }

  if (!message) {
    throw new Error(
      'Notification message is required.'
    );
  }

  const notificationRef =
    db.ref('notifications').push();

  const notification = {
    title,
    message,

    type:
      notificationData.type ||
      'general',

    target:
      notificationData.target ||
      'all',

    targetTelegramId:
      notificationData.targetTelegramId ||
      null,

    enabled:
      notificationData.enabled !== false,

    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await notificationRef.set(
    notification
  );

  return {
    id: notificationRef.key,
    ...notification
  };
}


// ===============================
// UPDATE NOTIFICATION
// ===============================
export async function updateNotification(
  notificationId,
  updates
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const notificationRef =
    db.ref(
      `notifications/${notificationId}`
    );

  const snapshot =
    await notificationRef.once('value');

  if (!snapshot.exists()) {
    throw new Error(
      'Notification not found.'
    );
  }

  await notificationRef.update({
    ...updates,
    updatedAt: Date.now()
  });

  const updated =
    await notificationRef.once('value');

  return {
    id: notificationId,
    ...updated.val()
  };
}


// ===============================
// DELETE NOTIFICATION
// ===============================
export async function deleteNotification(
  notificationId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const notificationRef =
    db.ref(
      `notifications/${notificationId}`
    );

  const snapshot =
    await notificationRef.once('value');

  if (!snapshot.exists()) {
    throw new Error(
      'Notification not found.'
    );
  }

  await notificationRef.remove();

  return {
    success: true,
    message:
      'Notification deleted successfully.'
  };
}


// ===============================
// MARK NOTIFICATION AS READ
// ===============================
export async function markAsRead(
  telegramId,
  notificationId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  if (!telegramId) {
    throw new Error(
      'Telegram ID is required.'
    );
  }

  if (!notificationId) {
    throw new Error(
      'Notification ID is required.'
    );
  }

  await db
    .ref(
      `notificationReads/${telegramId}/${notificationId}`
    )
    .set({
      read: true,
      readAt: Date.now()
    });

  return {
    success: true,
    notificationId
  };
}


// ===============================
// GET USER NOTIFICATIONS
// ===============================
export async function getUserNotifications(
  telegramId
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  if (!telegramId) {
    throw new Error(
      'Telegram ID is required.'
    );
  }

  const [
    notificationsSnapshot,
    readsSnapshot
  ] = await Promise.all([
    db
      .ref('notifications')
      .once('value'),

    db
      .ref(
        `notificationReads/${telegramId}`
      )
      .once('value')
  ]);

  if (!notificationsSnapshot.exists()) {
    return [];
  }

  const notifications =
    notificationsSnapshot.val();

  const reads =
    readsSnapshot.exists()
      ? readsSnapshot.val()
      : {};

  return Object.entries(notifications)
    .filter(
      ([, notification]) =>
        notification.enabled !== false
    )
    .filter(
      ([, notification]) => {
        const target =
          notification.target || 'all';

        if (target === 'all') {
          return true;
        }

        if (
          target === 'user' &&
          String(
            notification.targetTelegramId
          ) === String(telegramId)
        ) {
          return true;
        }

        return false;
      }
    )
    .map(([id, notification]) => ({
      id,
      ...notification,
      read: Boolean(
        reads[id]?.read
      )
    }))
    .sort(
      (a, b) =>
        Number(b.createdAt || 0) -
        Number(a.createdAt || 0)
    );
}
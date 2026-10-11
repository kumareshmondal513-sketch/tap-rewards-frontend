import { db } from './firebase.js';

const usersRef = db.ref('users');

function normalizeUserId(userId) {
  const id = String(userId || '').trim();

  if (!/^\d+$/.test(id)) {
    throw new Error('সঠিক ইউজার আইডি দিতে হবে');
  }

  return id;
}

// ইউজারের ব্লক স্ট্যাটাস দেখা
export async function getBanStatus(userId) {
  const id = normalizeUserId(userId);

  const snapshot = await usersRef
    .child(id)
    .child('ban')
    .once('value');

  const ban = snapshot.val() || {};

  return {
    banned: ban.banned === true,
    reason: ban.reason || '',
    bannedAt: Number(ban.bannedAt || 0),
    bannedBy: ban.bannedBy || null,
    expiresAt: Number(ban.expiresAt || 0)
  };
}

// ইউজারকে ব্লক করা
export async function banUser({
  userId,
  adminId,
  reason = 'অ্যাডমিন দ্বারা ব্লক করা হয়েছে',
  durationMs = 0
}) {
  const id = normalizeUserId(userId);

  if (!adminId) {
    throw new Error('অ্যাডমিন আইডি প্রয়োজন');
  }

  if (
    !Number.isFinite(durationMs) ||
    durationMs < 0
  ) {
    throw new Error('ব্লকের সময় সঠিক নয়');
  }

  const userSnapshot = await usersRef
    .child(id)
    .once('value');

  if (!userSnapshot.exists()) {
    throw new Error('ইউজার পাওয়া যায়নি');
  }

  const now = Date.now();

  const ban = {
    banned: true,
    reason: String(reason).trim().slice(0, 500),
    bannedAt: now,
    bannedBy: String(adminId),
    expiresAt:
      durationMs > 0
        ? now + durationMs
        : 0
  };

  await usersRef
    .child(id)
    .child('ban')
    .set(ban);

  return {
    success: true,
    userId: id,
    ban
  };
}

// ইউজারের ব্লক তুলে দেওয়া
export async function unbanUser({
  userId,
  adminId
}) {
  const id = normalizeUserId(userId);

  if (!adminId) {
    throw new Error('অ্যাডমিন আইডি প্রয়োজন');
  }

  const userSnapshot = await usersRef
    .child(id)
    .once('value');

  if (!userSnapshot.exists()) {
    throw new Error('ইউজার পাওয়া যায়নি');
  }

  await usersRef
    .child(id)
    .child('ban')
    .set({
      banned: false,
      reason: '',
      bannedAt: 0,
      bannedBy: String(adminId),
      expiresAt: 0
    });

  return {
    success: true,
    userId: id,
    message: 'ইউজারের ব্লক তুলে দেওয়া হয়েছে'
  };
}
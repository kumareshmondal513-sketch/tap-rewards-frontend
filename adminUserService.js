import { db } from './firebase.js';

const usersRef = db.ref('users');

// নির্দিষ্ট ইউজারের তথ্য দেখা
export async function getAdminUser(userId) {
  if (!userId) {
    throw new Error('userId দিতে হবে');
  }

  const snapshot = await usersRef
    .child(String(userId))
    .once('value');

  if (!snapshot.exists()) {
    throw new Error('ইউজার পাওয়া যায়নি');
  }

  return {
    userId: String(userId),
    ...snapshot.val()
  };
}

// ইউজারকে স্থগিত করা
export async function suspendUser({
  userId,
  adminId,
  reason
}) {
  if (!userId || !adminId || !reason) {
    throw new Error(
      'userId, adminId এবং কারণ দিতে হবে'
    );
  }

  const userRef = usersRef.child(String(userId));
  const snapshot = await userRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('ইউজার পাওয়া যায়নি');
  }

  await userRef.update({
    status: 'suspended',
    suspensionReason: String(reason),
    suspendedBy: String(adminId),
    suspendedAt: Date.now()
  });

  return {
    success: true,
    userId: String(userId),
    status: 'suspended'
  };
}

// স্থগিত ইউজার পুনরায় সক্রিয় করা
export async function activateUser({
  userId,
  adminId
}) {
  if (!userId || !adminId) {
    throw new Error(
      'userId এবং adminId দিতে হবে'
    );
  }

  const userRef = usersRef.child(String(userId));
  const snapshot = await userRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('ইউজার পাওয়া যায়নি');
  }

  await userRef.update({
    status: 'active',
    suspensionReason: null,
    suspendedBy: null,
    suspendedAt: null,
    activatedBy: String(adminId),
    activatedAt: Date.now()
  });

  return {
    success: true,
    userId: String(userId),
    status: 'active'
  };
}
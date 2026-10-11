import { db } from './firebase.js';

const adminsRef = db.ref('admins');

// অ্যাডমিনের তথ্য দেখা
export async function getAdminAuth(adminId) {
  if (!adminId) {
    throw new Error('adminId দিতে হবে');
  }

  const snapshot = await adminsRef
    .child(String(adminId))
    .once('value');

  if (!snapshot.exists()) {
    return null;
  }

  const admin = snapshot.val();

  if (
    admin.status !== 'active' ||
    admin.role === 'suspended'
  ) {
    return null;
  }

  return {
    id: String(adminId),
    role: admin.role || 'admin',
    status: admin.status,
    permissions: Array.isArray(admin.permissions)
      ? admin.permissions
      : []
  };
}

// নির্দিষ্ট কাজের অনুমতি আছে কি না
export async function hasAdminPermission({
  adminId,
  permission
}) {
  if (!adminId || !permission) {
    return false;
  }

  const admin = await getAdminAuth(adminId);

  if (!admin) {
    return false;
  }

  if (
    admin.role === 'main_admin' ||
    admin.role === 'chairman'
  ) {
    return true;
  }

  return admin.permissions.includes(permission);
}

// অ্যাডমিনের অবস্থা পরিবর্তন
export async function setAdminStatus({
  targetAdminId,
  status
}) {
  if (!targetAdminId || !status) {
    throw new Error(
      'targetAdminId এবং status দিতে হবে'
    );
  }

  if (!['active', 'suspended'].includes(status)) {
    throw new Error(
      'status active অথবা suspended হতে হবে'
    );
  }

  const ref = adminsRef.child(
    String(targetAdminId)
  );

  const snapshot = await ref.once('value');

  if (!snapshot.exists()) {
    throw new Error('অ্যাডমিন পাওয়া যায়নি');
  }

  const admin = snapshot.val();

  if (admin.role === 'main_admin') {
    throw new Error(
      'মূল অ্যাডমিনের অবস্থা পরিবর্তন করা যাবে না'
    );
  }

  await ref.update({
    status,
    updatedAt: Date.now()
  });

  return {
    success: true,
    adminId: String(targetAdminId),
    status
  };
}
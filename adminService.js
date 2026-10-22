import { db } from "./firebase.js";

function getAdminsRef() {
  if (!database) {
    throw new Error("Firebase database is not configured");
  }

  return db.ref("admins");
}

export async function getAdmin(adminId) {
  const snapshot = await getAdminsRef()
    .child(String(adminId))
    .get();

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: String(adminId),
    ...snapshot.val()
  };
}

export async function isAdmin(adminId) {
  if (!adminId) {
    return false;
  }

  const admin = await getAdmin(adminId);

  return Boolean(admin && admin.active === true);
}

export async function getAllAdmins() {
  const snapshot = await getAdminsRef().get();

  if (!snapshot.exists()) {
    return [];
  }

  return Object.entries(snapshot.val()).map(([id, admin]) => ({
    id,
    ...admin
  }));
}

export async function addAdmin(
  adminId,
  role = "admin",
  addedBy = "system"
) {
  const id = String(adminId);

  if (!/^\d+$/.test(id)) {
    throw new Error("Invalid admin ID");
  }

  const allowedRoles = [
    "main_admin",
    "admin",
    "moderator"
  ];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid admin role");
  }

  const adminRef = getAdminsRef().child(id);
  const snapshot = await adminRef.get();

  if (snapshot.exists()) {
    throw new Error("Admin already exists");
  }

  const admin = {
    role,
    active: true,
    addedBy: String(addedBy),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await adminRef.set(admin);

  return {
    id,
    ...admin
  };
}

export async function setAdminStatus(adminId, active) {
  if (typeof active !== "boolean") {
    throw new Error("Active status must be true or false");
  }

  const adminRef = getAdminsRef().child(String(adminId));
  const snapshot = await adminRef.get();

  if (!snapshot.exists()) {
    throw new Error("Admin not found");
  }

  const admin = snapshot.val();

  if (admin.role === "main_admin" && active === false) {
    throw new Error("Main admin cannot be deactivated");
  }

  await adminRef.update({
    active,
    updatedAt: Date.now()
  });

  const updated = await adminRef.get();

  return {
    id: String(adminId),
    ...updated.val()
  };
}

export async function removeAdmin(adminId) {
  const adminRef = getAdminsRef().child(String(adminId));
  const snapshot = await adminRef.get();

  if (!snapshot.exists()) {
    throw new Error("Admin not found");
  }

  const admin = snapshot.val();

  if (admin.role === "main_admin") {
    throw new Error("Main admin cannot be removed");
  }

  await adminRef.remove();

  return {
    success: true,
    adminId: String(adminId)
  };
}

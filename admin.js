import { apiGet } from './apiClient.js';

export async function getAdminStatus() {
  return apiGet('/api/admin/status');
}

export async function getAdminDashboard() {
  return apiGet('/api/admin/dashboard');
}

export function isAdminUser(user) {
  return Boolean(
    user &&
    (
      user.role === 'admin' ||
      user.role === 'main_admin'
    )
  );
}

export function getAdminRoleLabel(user) {
  if (!isAdminUser(user)) {
    return 'User';
  }

  return user.role === 'main_admin'
    ? 'Main Admin'
    : 'Admin';
}
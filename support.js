import { apiGet, apiPost } from './apiClient.js';

export async function getSupportInfo() {
  return apiGet('/api/support');
}

export async function sendSupportMessage({
  subject,
  message
}) {
  if (
    typeof subject !== 'string' ||
    subject.trim().length < 3 ||
    subject.trim().length > 100
  ) {
    throw new Error(
      'Subject must be between 3 and 100 characters.'
    );
  }

  if (
    typeof message !== 'string' ||
    message.trim().length < 5 ||
    message.trim().length > 2000
  ) {
    throw new Error(
      'Message must be between 5 and 2000 characters.'
    );
  }

  return apiPost('/api/support/messages', {
    subject: subject.trim(),
    message: message.trim()
  });
}
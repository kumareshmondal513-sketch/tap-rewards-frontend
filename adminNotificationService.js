import { db } from './firebase.js';

import {
  sendTelegramMessage
} from './telegramApiService.js';

const adminsRef = db.ref('admins');

// সক্রিয় অ্যাডমিনদের Telegram ID সংগ্রহ
export async function getActiveAdminIds() {
  const snapshot = await adminsRef.once('value');

  if (!snapshot.exists()) {
    return [];
  }

  const admins = snapshot.val();

  return Object.entries(admins)
    .filter(([, admin]) => {
      return (
        admin &&
        admin.status === 'active' &&
        admin.telegramChatId
      );
    })
    .map(([adminId, admin]) => ({
      adminId,
      chatId: admin.telegramChatId
    }));
}

// সব সক্রিয় অ্যাডমিনকে নোটিফিকেশন পাঠানো
export async function notifyActiveAdmins({
  title,
  message
}) {
  if (!title || !message) {
    throw new Error(
      'title এবং message দিতে হবে'
    );
  }

  const admins = await getActiveAdminIds();

  const results = await Promise.allSettled(
    admins.map((admin) =>
      sendTelegramMessage({
        chatId: admin.chatId,
        text: `${title}\n\n${message}`
      })
    )
  );

  return {
    success: true,
    totalAdmins: admins.length,
    sent: results.filter(
      (result) => result.status === 'fulfilled'
    ).length,
    failed: results.filter(
      (result) => result.status === 'rejected'
    ).length
  };
}

// নতুন উইথড্রয়াল আবেদনের নোটিফিকেশন
export async function notifyWithdrawalRequest({
  userId,
  amount,
  withdrawalId
}) {
  return notifyActiveAdmins({
    title: 'নতুন উইথড্রয়াল আবেদন',
    message:
      `User ID: ${userId}\n` +
      `Amount: ${amount}\n` +
      `Request ID: ${withdrawalId}`
  });
}

// নতুন ভেরিফিকেশন আবেদনের নোটিফিকেশন
export async function notifyVerificationRequest({
  userId,
  fullName
}) {
  return notifyActiveAdmins({
    title: 'নতুন ভেরিফিকেশন আবেদন',
    message:
      `User ID: ${userId}\n` +
      `নাম: ${fullName}`
  });
}
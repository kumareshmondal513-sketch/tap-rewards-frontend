import { db } from './firebase.js';

const announcementsRef =
  db.ref('announcements');

// নতুন ঘোষণা তৈরি
export async function createAnnouncement({
  adminId,
  title,
  message
}) {
  if (!adminId) {
    throw new Error('অ্যাডমিন আইডি প্রয়োজন');
  }

  if (
    typeof title !== 'string' ||
    !title.trim() ||
    title.trim().length > 150
  ) {
    throw new Error(
      'ঘোষণার শিরোনাম ১ থেকে ১৫০ অক্ষরের মধ্যে হতে হবে'
    );
  }

  if (
    typeof message !== 'string' ||
    !message.trim() ||
    message.trim().length > 3000
  ) {
    throw new Error(
      'ঘোষণার বার্তা ১ থেকে ৩০০০ অক্ষরের মধ্যে হতে হবে'
    );
  }

  const announcement = {
    title: title.trim(),
    message: message.trim(),
    active: true,
    createdAt: Date.now(),
    createdBy: String(adminId)
  };

  const announcementRef =
    announcementsRef.push();

  await announcementRef.set(announcement);

  return {
    success: true,
    announcementId: announcementRef.key,
    announcement
  };
}

// সক্রিয় ঘোষণাগুলো দেখা
export async function getActiveAnnouncements(
  limit = 20
) {
  const safeLimit = Math.min(
    50,
    Math.max(1, Number(limit) || 20)
  );

  const snapshot = await announcementsRef
    .orderByChild('createdAt')
    .limitToLast(safeLimit)
    .once('value');

  const announcements = [];

  snapshot.forEach((child) => {
    const item = child.val() || {};

    if (item.active === true) {
      announcements.push({
        id: child.key,
        title: item.title || '',
        message: item.message || '',
        createdAt: Number(item.createdAt || 0)
      });
    }
  });

  announcements.sort(
    (a, b) => b.createdAt - a.createdAt
  );

  return announcements;
}

// ঘোষণা বন্ধ বা পুনরায় চালু
export async function setAnnouncementStatus({
  announcementId,
  active
}) {
  if (
    typeof announcementId !== 'string' ||
    !announcementId.trim()
  ) {
    throw new Error('ঘোষণার আইডি প্রয়োজন');
  }

  if (typeof active !== 'boolean') {
    throw new Error(
      'active true অথবা false হতে হবে'
    );
  }

  const itemRef = announcementsRef
    .child(announcementId);

  const snapshot = await itemRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('ঘোষণা পাওয়া যায়নি');
  }

  await itemRef.update({ active });

  return {
    success: true,
    announcementId,
    active
  };
}
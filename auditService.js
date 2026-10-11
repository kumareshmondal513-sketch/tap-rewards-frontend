import { db } from './firebase.js';

const auditRef = db.ref('auditLogs');

// অডিট রেকর্ড তৈরি
export async function recordAuditEvent({
  actorId,
  action,
  targetId = null,
  details = {}
}) {
  if (!actorId) {
    throw new Error('কার্য সম্পাদনকারীর আইডি প্রয়োজন');
  }

  if (
    typeof action !== 'string' ||
    !action.trim()
  ) {
    throw new Error('অ্যাকশনের নাম দিতে হবে');
  }

  const safeDetails =
    details &&
    typeof details === 'object' &&
    !Array.isArray(details)
      ? details
      : {};

  const event = {
    actorId: String(actorId),
    action: action.trim().slice(0, 100),
    targetId:
      targetId === null
        ? null
        : String(targetId),
    details: safeDetails,
    createdAt: Date.now()
  };

  const eventRef = auditRef.push();

  await eventRef.set(event);

  return {
    success: true,
    auditId: eventRef.key
  };
}

// সাম্প্রতিক অডিট রেকর্ড দেখা
export async function getRecentAuditEvents(
  limit = 50
) {
  const safeLimit = Math.min(
    100,
    Math.max(1, Number(limit) || 50)
  );

  const snapshot = await auditRef
    .orderByChild('createdAt')
    .limitToLast(safeLimit)
    .once('value');

  const events = [];

  snapshot.forEach((child) => {
    events.push({
      id: child.key,
      ...child.val()
    });
  });

  return events.sort(
    (a, b) => b.createdAt - a.createdAt
  );
}
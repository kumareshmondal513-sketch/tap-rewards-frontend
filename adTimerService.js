import { db } from './firebase.js';

const adTimerRef = db.ref('adTimers');

// বিজ্ঞাপন দেখার টাইমার শুরু
export async function startAdTimer({
  userId,
  adId,
  durationSeconds = 15
}) {
  if (!userId || !adId) {
    throw new Error(
      'userId এবং adId দিতে হবে'
    );
  }

  const duration = Number(durationSeconds);

  if (
    !Number.isInteger(duration) ||
    duration < 1 ||
    duration > 300
  ) {
    throw new Error(
      'সময় ১ থেকে ৩০০ সেকেন্ডের মধ্যে হতে হবে'
    );
  }

  const timerId = `${userId}_${adId}`;
  const now = Date.now();

  const timer = {
    userId: String(userId),
    adId: String(adId),
    durationSeconds: duration,
    startedAt: now,
    expiresAt: now + duration * 1000,
    status: 'running',
    completedAt: null
  };

  await adTimerRef.child(timerId).set(timer);

  return {
    success: true,
    timerId,
    durationSeconds: duration,
    expiresAt: timer.expiresAt
  };
}

// বিজ্ঞাপনের সময় শেষ হয়েছে কি না পরীক্ষা
export async function completeAdTimer({
  userId,
  adId
}) {
  if (!userId || !adId) {
    throw new Error(
      'userId এবং adId দিতে হবে'
    );
  }

  const timerId = `${userId}_${adId}`;
  const ref = adTimerRef.child(timerId);
  const snapshot = await ref.once('value');

  if (!snapshot.exists()) {
    throw new Error(
      'বিজ্ঞাপনের টাইমার পাওয়া যায়নি'
    );
  }

  const timer = snapshot.val();

  if (timer.status === 'completed') {
    return {
      success: true,
      alreadyCompleted: true,
      message: 'বিজ্ঞাপন আগে থেকেই সম্পন্ন হয়েছে'
    };
  }

  const now = Date.now();

  if (now < Number(timer.expiresAt)) {
    const remainingSeconds = Math.ceil(
      (Number(timer.expiresAt) - now) / 1000
    );

    return {
      success: false,
      remainingSeconds,
      message: 'বিজ্ঞাপনের সময় এখনো শেষ হয়নি'
    };
  }

  await ref.update({
    status: 'completed',
    completedAt: now
  });

  return {
    success: true,
    alreadyCompleted: false,
    message: 'বিজ্ঞাপনের সময় সম্পন্ন হয়েছে'
  };
}

// টাইমারের অবস্থা দেখা
export async function getAdTimer({
  userId,
  adId
}) {
  if (!userId || !adId) {
    throw new Error(
      'userId এবং adId দিতে হবে'
    );
  }

  const timerId = `${userId}_${adId}`;
  const snapshot = await adTimerRef
    .child(timerId)
    .once('value');

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
}
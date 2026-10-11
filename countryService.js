import { db } from './firebase.js';

const usersRef = db.ref('users');

// দেশের কোড যাচাই
function normalizeCountryCode(countryCode) {
  const code = String(countryCode || '')
    .trim()
    .toUpperCase();

  if (!/^[A-Z]{2}$/.test(code)) {
    throw new Error(
      'দুই অক্ষরের সঠিক country code দিতে হবে'
    );
  }

  return code;
}

// ইউজারের দেশ সংরক্ষণ
export async function setUserCountry({
  userId,
  countryCode
}) {
  const id = String(userId || '').trim();

  if (!/^\d{1,20}$/.test(id)) {
    throw new Error('সঠিক ইউজার আইডি দিতে হবে');
  }

  const code = normalizeCountryCode(countryCode);

  const userRef = usersRef.child(id);
  const snapshot = await userRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('ইউজার পাওয়া যায়নি');
  }

  await userRef.child('country').set(code);

  return {
    success: true,
    userId: id,
    countryCode: code
  };
}

// দেশের ভিত্তিতে ইউজারের সংখ্যা গণনা
export async function getCountryUserCounts() {
  const snapshot = await usersRef.once('value');
  const counts = {};

  snapshot.forEach((child) => {
    const user = child.val() || {};
    const code = String(
      user.country || 'UNKNOWN'
    ).toUpperCase();

    counts[code] = (counts[code] || 0) + 1;
  });

  return counts;
}
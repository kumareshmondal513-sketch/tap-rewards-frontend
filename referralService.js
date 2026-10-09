import { db } from './firebase.js';

const REFERRAL_REWARD = 100;
const MAX_TEAM_SIZE = 200;

export async function registerReferral(
  newUserId,
  referralCode
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  if (!referralCode) {
    return {
      success: false,
      message: 'No referral code provided.'
    };
  }

  const referrerId = String(referralCode);

  if (referrerId === String(newUserId)) {
    return {
      success: false,
      message: 'You cannot refer yourself.'
    };
  }

  const referrerRef = db.ref(`users/${referrerId}`);
  const newUserRef = db.ref(`users/${newUserId}`);

  const [referrerSnapshot, newUserSnapshot] =
    await Promise.all([
      referrerRef.once('value'),
      newUserRef.once('value')
    ]);

  if (!referrerSnapshot.exists()) {
    return {
      success: false,
      message: 'Referrer not found.'
    };
  }

  if (!newUserSnapshot.exists()) {
    return {
      success: false,
      message: 'User not found.'
    };
  }

  const referrer = referrerSnapshot.val();
  const newUser = newUserSnapshot.val();

  if (newUser.referredBy) {
    return {
      success: false,
      message: 'Referral already registered.'
    };
  }

  const teamSize = Number(referrer.referralCount || 0);

  if (teamSize >= MAX_TEAM_SIZE) {
    return {
      success: false,
      message: 'Referrer team is full.'
    };
  }

  await newUserRef.update({
    referredBy: referrerId,
    referralRegisteredAt: Date.now(),
    updatedAt: Date.now()
  });

  await referrerRef.update({
    referralCount: teamSize + 1,
    coins:
      Number(referrer.coins || 0) +
      REFERRAL_REWARD,
    totalEarned:
      Number(referrer.totalEarned || 0) +
      REFERRAL_REWARD,
    updatedAt: Date.now()
  });

  return {
    success: true,
    reward: REFERRAL_REWARD,
    referrerId
  };
}

export async function getReferralInfo(telegramId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref(`users/${telegramId}`)
    .once('value');

  if (!snapshot.exists()) {
    throw new Error('User not found.');
  }

  const user = snapshot.val();

  return {
    referralCode: String(telegramId),
    referralCount: Number(user.referralCount || 0),
    maxTeamSize: MAX_TEAM_SIZE,
    referredBy: user.referredBy || null
  };
}
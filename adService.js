import { db } from './firebase.js';


// ===============================
// GET ALL ADS
// ===============================
export async function getAds() {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref('ads')
    .once('value');

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(
    ([id, ad]) => ({
      id,
      ...ad
    })
  );
}


// ===============================
// GET ONE AD
// ===============================
export async function getAd(adId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const snapshot = await db
    .ref(`ads/${adId}`)
    .once('value');

  if (!snapshot.exists()) {
    throw new Error('Ad not found.');
  }

  return {
    id: adId,
    ...snapshot.val()
  };
}


// ===============================
// CREATE AD
// ===============================
export async function createAd(adData) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  if (!adData.title) {
    throw new Error('Ad title is required.');
  }

  if (!adData.url) {
    throw new Error('Ad URL is required.');
  }

  const adRef = db
    .ref('ads')
    .push();

  const ad = {
    title: adData.title,
    description:
      adData.description || '',
    url: adData.url,
    reward: Number(
      adData.reward || 0
    ),
    duration: Number(
      adData.duration || 10
    ),
    rewardMultiplier: Number(
      adData.rewardMultiplier || 1
    ),
    enabled:
      adData.enabled !== false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await adRef.set(ad);

  return {
    id: adRef.key,
    ...ad
  };
}


// ===============================
// UPDATE AD
// ===============================
export async function updateAd(
  adId,
  updates
) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const adRef =
    db.ref(`ads/${adId}`);

  const snapshot =
    await adRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('Ad not found.');
  }

  await adRef.update({
    ...updates,
    updatedAt: Date.now()
  });

  const updated =
    await adRef.once('value');

  return {
    id: adId,
    ...updated.val()
  };
}


// ===============================
// DELETE AD
// ===============================
export async function deleteAd(adId) {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  const adRef =
    db.ref(`ads/${adId}`);

  const snapshot =
    await adRef.once('value');

  if (!snapshot.exists()) {
    throw new Error('Ad not found.');
  }

  await adRef.remove();

  return {
    success: true,
    message: 'Ad deleted successfully.'
  };
}


// ===============================
// ENABLE / DISABLE AD
// ===============================
export async function setAdStatus(
  adId,
  enabled
) {
  return updateAd(
    adId,
    {
      enabled: Boolean(enabled)
    }
  );
}
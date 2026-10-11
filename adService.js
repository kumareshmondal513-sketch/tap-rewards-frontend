import { database } from "./firebase.js";

function getAdsRef() {
  if (!database) {
    throw new Error("Firebase database is not configured");
  }

  return database.ref("ads");
}

export async function getAllAds() {
  const snapshot = await getAdsRef().get();

  if (!snapshot.exists()) {
    return [];
  }

  return Object.entries(snapshot.val()).map(([id, ad]) => ({
    id,
    ...ad
  }));
}

export async function getActiveAds() {
  const ads = await getAllAds();

  return ads.filter((ad) => ad.active === true);
}

export async function getAd(adId) {
  const snapshot = await getAdsRef()
    .child(String(adId))
    .get();

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: String(adId),
    ...snapshot.val()
  };
}

export async function createAd(data = {}) {
  const title = String(data.title || "").trim();
  const url = String(data.url || "").trim();
  const type = String(data.type || "general");
  const duration = Number(data.duration ?? 10);

  if (!title || title.length > 120) {
    throw new Error("Ad title is required and must be under 120 characters");
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid ad URL");
  }

  if (!["https:", "http:"].includes(parsedUrl.protocol)) {
    throw new Error("Ad URL must use HTTP or HTTPS");
  }

  if (
    !Number.isSafeInteger(duration) ||
    duration < 0 ||
    duration > 3600
  ) {
    throw new Error("Ad duration must be between 0 and 3600 seconds");
  }

  const adRef = getAdsRef().push();

  const ad = {
    title,
    url: parsedUrl.href,
    type,
    duration,
    active: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await adRef.set(ad);

  return {
    id: adRef.key,
    ...ad
  };
}

export async function updateAd(adId, updates = {}) {
  const adRef = getAdsRef().child(String(adId));
  const snapshot = await adRef.get();

  if (!snapshot.exists()) {
    throw new Error("Ad not found");
  }

  const safeUpdates = {};

  if (updates.title !== undefined) {
    const title = String(updates.title).trim();

    if (!title || title.length > 120) {
      throw new Error("Invalid ad title");
    }

    safeUpdates.title = title;
  }

  if (updates.url !== undefined) {
    let parsedUrl;

    try {
      parsedUrl = new URL(String(updates.url).trim());
    } catch {
      throw new Error("Invalid ad URL");
    }

    if (!["https:", "http:"].includes(parsedUrl.protocol)) {
      throw new Error("Ad URL must use HTTP or HTTPS");
    }

    safeUpdates.url = parsedUrl.href;
  }

  if (updates.duration !== undefined) {
    const duration = Number(updates.duration);

    if (
      !Number.isSafeInteger(duration) ||
      duration < 0 ||
      duration > 3600
    ) {
      throw new Error("Ad duration must be between 0 and 3600 seconds");
    }

    safeUpdates.duration = duration;
  }

  if (updates.type !== undefined) {
    safeUpdates.type = String(updates.type);
  }

  if (typeof updates.active === "boolean") {
    safeUpdates.active = updates.active;
  }

  if (Object.keys(safeUpdates).length === 0) {
    throw new Error("No valid ad updates provided");
  }

  safeUpdates.updatedAt = Date.now();

  await adRef.update(safeUpdates);

  const updated = await adRef.get();

  return {
    id: String(adId),
    ...updated.val()
  };
}

export async function deleteAd(adId) {
  const adRef = getAdsRef().child(String(adId));
  const snapshot = await adRef.get();

  if (!snapshot.exists()) {
    throw new Error("Ad not found");
  }

  await adRef.remove();

  return {
    success: true,
    adId: String(adId)
  };
}
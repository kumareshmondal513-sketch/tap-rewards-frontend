import crypto from "crypto";

export function validateTelegramInitData(initData, botToken) {
  if (!initData || !botToken) {
    return {
      valid: false,
      error: "Missing initData or bot token",
    };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");

    if (!hash) {
      return {
        valid: false,
        error: "Missing hash",
      };
    }

    params.delete("hash");

    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    const valid =
      calculatedHash.length === hash.length &&
      crypto.timingSafeEqual(
        Buffer.from(calculatedHash, "hex"),
        Buffer.from(hash, "hex")
      );

    if (!valid) {
      return {
        valid: false,
        error: "Invalid Telegram initData",
      };
    }

    const userData = params.get("user");

    return {
      valid: true,
      user: userData ? JSON.parse(userData) : null,
      authDate: params.get("auth_date"),
      queryId: params.get("query_id"),
    };
  } catch (error) {
    return {
      valid: false,
      error: "Invalid initData format",
    };
  }
}
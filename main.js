import {
  initTelegram,
  getTelegramUser
} from "./telegram.js";

import { showNotification } from "./notifications.js";
import {
  fetchUserProfile,
  submitTapToBackend
} from "./backendApi.js";

const BALANCE_KEY = "tapbot_balance";

let tapInProgress = false;
let serverMode = false;

function setBalance(value) {
  const balance = document.getElementById("balance");

  if (balance) {
    balance.textContent = Number(value).toLocaleString();
  }

  if (!serverMode) {
    localStorage.setItem(BALANCE_KEY, String(value));
  }
}

function getDemoBalance() {
  const value = Number(localStorage.getItem(BALANCE_KEY) || 0);

  return Number.isSafeInteger(value) && value >= 0
    ? value
    : 0;
}

function displayUser() {
  const user = getTelegramUser();
  const name = document.getElementById("user-name");

  if (name) {
    name.textContent = user
      ? [user.first_name, user.last_name]
          .filter(Boolean)
          .join(" ")
      : "Guest";
  }
}

function getProfileBalance(profile) {
  const user = profile?.user || profile?.profile || profile;

  const balance = Number(
    user?.balance ?? user?.coins
  );

  return Number.isFinite(balance) && balance >= 0
    ? balance
    : null;
}

async function loadProfile() {
  try {
    const profile = await fetchUserProfile();
    const balance = getProfileBalance(profile);

    if (balance !== null) {
      serverMode = true;
      setBalance(balance);
      return;
    }

    console.warn("Profile response has no recognized balance.");
  } catch (error) {
    console.warn("Backend profile unavailable:", error.message);
  }

  serverMode = false;
  setBalance(getDemoBalance());
}

async function handleTap() {
  if (tapInProgress) return;

  const button = document.getElementById("tap-button");
  const message = document.getElementById("tap-message");

  if (serverMode) {
    tapInProgress = true;
    button.disabled = true;

    try {
      const result = await submitTapToBackend();
      const balance = getProfileBalance(result);

      if (balance !== null) {
        setBalance(balance);
      } else {
        await loadProfile();
      }

      if (message) {
        message.textContent = "Tap submitted.";
      }
    } catch (error) {
      if (message) {
        message.textContent = error.message;
      }
    } finally {
      tapInProgress = false;
      button.disabled = false;
    }

    return;
  }

  const nextBalance = getDemoBalance() + 1;
  setBalance(nextBalance);

  if (message) {
    message.textContent = "+1 demo coin — not saved to the server";
  }

  window.Telegram?.WebApp?.HapticFeedback
    ?.impactOccurred("light");
}

function startApp() {
  try {
    initTelegram();
  } catch (error) {
    console.warn("Telegram initialization failed:", error);
  }

  displayUser();

  const button = document.getElementById("tap-button");

  if (button) {
    button.addEventListener("click", handleTap);
  }

  loadProfile();

  try {
    showNotification("Tap Rewards is ready!", "success");
  } catch (error) {
    console.log("Tap Rewards is ready.");
  }
}

document.addEventListener("DOMContentLoaded", startApp);
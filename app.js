import {
  getLocalData,
  saveLocalData
} from './storage.js';

import {
  isValidCoinAmount
} from './validation.js';

const TAP_REWARD = 1;
const BALANCE_KEY = 'demoBalance';

let balance = getLocalData(BALANCE_KEY, 0);

if (!isValidCoinAmount(balance)) {
  balance = 0;
}

const balanceElement = document.getElementById('balance');
const tapButton = document.getElementById('tap-button');
const messageElement = document.getElementById('tap-message');

function updateBalance() {
  if (balanceElement) {
    balanceElement.textContent =
      balance.toLocaleString();
  }
}

function handleTap() {
  if (!isValidCoinAmount(balance)) {
    balance = 0;
  }

  if (balance > 999999999 - TAP_REWARD) {
    if (messageElement) {
      messageElement.textContent =
        'Maximum demo balance reached.';
    }

    return;
  }

  balance += TAP_REWARD;

  saveLocalData(BALANCE_KEY, balance);
  updateBalance();

  if (messageElement) {
    messageElement.textContent =
      `+${TAP_REWARD} coin earned! (Demo mode)`;
  }
}

if (tapButton) {
  tapButton.addEventListener('click', handleTap);
} else {
  console.error('Tap button was not found.');
}

updateBalance();
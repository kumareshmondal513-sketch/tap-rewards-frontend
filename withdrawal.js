import { apiGet, apiPost } from './apiClient.js';

export async function getWithdrawalInfo() {
  return apiGet('/api/withdrawals');
}

export async function submitWithdrawalRequest({
  amount,
  method,
  accountNumber,
  countryCode
}) {
  const numericAmount = Number(amount);

  if (
    !Number.isSafeInteger(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error('Enter a valid withdrawal amount.');
  }

  if (
    typeof method !== 'string' ||
    method.trim().length < 2 ||
    method.trim().length > 40
  ) {
    throw new Error('Select a valid payment method.');
  }

  if (
    typeof accountNumber !== 'string' ||
    accountNumber.trim().length < 4 ||
    accountNumber.trim().length > 100
  ) {
    throw new Error('Enter valid payment account details.');
  }

  if (
    typeof countryCode !== 'string' ||
    !/^[A-Za-z]{2}$/.test(countryCode)
  ) {
    throw new Error('Select a valid country.');
  }

  return apiPost('/api/withdrawals', {
    amount: numericAmount,
    method: method.trim(),
    accountNumber: accountNumber.trim(),
    countryCode: countryCode.toUpperCase()
  });
}
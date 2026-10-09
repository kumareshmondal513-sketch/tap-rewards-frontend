const API_BASE_URL = '';


// =====================================
// GENERIC REQUEST
// =====================================

async function request(
  endpoint,
  options = {}
) {
  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,

        headers: {
          'Content-Type':
            'application/json',

          ...(options.headers || {})
        }
      }
    );

  const data =
    await response.json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Request failed.'
    );
  }

  return data;
}


// =====================================
// GET USER
// =====================================

export async function getUser(
  telegramId
) {
  return request(
    `/api/users/${telegramId}`
  );
}


// =====================================
// CREATE USER
// =====================================

export async function createUser(
  user
) {
  return request(
    '/api/users',
    {
      method: 'POST',

      body: JSON.stringify({
        id: user.id,
        first_name:
          user.first_name || '',
        last_name:
          user.last_name || '',
        username:
          user.username || ''
      })
    }
  );
}


// =====================================
// TAP
// =====================================

export async function tap(
  telegramId,
  tapCount = 1
) {
  return request(
    '/api/tap/tap',
    {
      method: 'POST',

      body: JSON.stringify({
        telegramId,
        tapCount
      })
    }
  );
}


// =====================================
// TAP SETTINGS
// =====================================

export async function getTapSettings() {
  return request(
    '/api/tap/settings'
  );
}


// =====================================
// DAILY REWARD
// =====================================

export async function getDailyReward() {
  return request(
    '/api/rewards/daily'
  );
}


export async function claimDailyReward(
  telegramId
) {
  return request(
    '/api/rewards/daily/claim',
    {
      method: 'POST',

      body: JSON.stringify({
        telegramId
      })
    }
  );
}


// =====================================
// ENERGY
// =====================================

export async function getEnergy(
  telegramId
) {
  return request(
    `/api/energy/${telegramId}`
  );
}


export async function refillEnergy(
  telegramId
) {
  return request(
    '/api/energy/refill',
    {
      method: 'POST',

      body: JSON.stringify({
        telegramId
      })
    }
  );
}


export async function upgradeEnergy(
  telegramId,
  increase = 1000
) {
  return request(
    '/api/energy/upgrade',
    {
      method: 'POST',

      body: JSON.stringify({
        telegramId,
        increase
      })
    }
  );
}


// =====================================
// LEVEL
// =====================================

export async function getLevel(
  telegramId
) {
  return request(
    `/api/levels/${telegramId}`
  );
}


// =====================================
// REFERRAL
// =====================================

export async function getReferralInfo(
  telegramId
) {
  return request(
    `/api/referrals/${telegramId}`
  );
}


export async function registerReferral(
  newUserId,
  referralCode
) {
  return request(
    '/api/referrals/register',
    {
      method: 'POST',

      body: JSON.stringify({
        newUserId,
        referralCode
      })
    }
  );
}


// =====================================
// TASKS
// =====================================

export async function getTasks() {
  return request(
    '/api/tasks'
  );
}


export async function getUserTasks(
  telegramId
) {
  return request(
    `/api/user-tasks/${telegramId}`
  );
}


export async function completeTask(
  telegramId,
  taskId,
  verificationCode = ''
) {
  return request(
    `/api/user-tasks/${telegramId}/${taskId}/complete`,
    {
      method: 'POST',

      body: JSON.stringify({
        verificationCode
      })
    }
  );
}


// =====================================
// WITHDRAWAL
// =====================================

export async function getWithdrawalSettings() {
  return request(
    '/api/withdrawals/settings'
  );
}


export async function createWithdrawal(
  data
) {
  return request(
    '/api/withdrawals',
    {
      method: 'POST',

      body: JSON.stringify(data)
    }
  );
}


export async function getUserWithdrawals(
  telegramId
) {
  return request(
    `/api/withdrawals/user/${telegramId}`
  );
}


// =====================================
// TRANSACTIONS
// =====================================

export async function getTransactions(
  telegramId
) {
  return request(
    `/api/transactions/${telegramId}`
  );
}


// =====================================
// ADS
// =====================================

export async function getAds() {
  return request(
    '/api/ads'
  );
}


export async function getAd(
  adId
) {
  return request(
    `/api/ads/${adId}`
  );
}


// =====================================
// NOTIFICATIONS
// =====================================

export async function getUserNotifications(
  telegramId
) {
  return request(
    `/api/notifications/user/${telegramId}`
  );
}


export async function markNotificationRead(
  telegramId,
  notificationId
) {
  return request(
    `/api/notifications/user/${telegramId}/${notificationId}/read`,
    {
      method: 'POST'
    }
  );
}


// =====================================
// APP CONFIG
// =====================================

export async function getAppConfig() {
  return request(
    '/api/config'
  );
}
import {
  getLocalData,
  saveLocalData
} from './storage.js';

const translations = {
  en: {
    appName: 'Tap Rewards',
    welcome: 'Welcome',
    balance: 'Your Balance',
    coins: 'Coins',
    tap: 'TAP',
    ready: 'Ready to play?',
    tapSuccess: 'Coin earned!',
    tasks: 'Tasks',
    referrals: 'Referrals',
    dailyReward: 'Daily Reward',
    loading: 'Loading...',
    error: 'Something went wrong.',
    language: 'Language'
  },

  bn: {
    appName: 'ট্যাপ রিওয়ার্ডস',
    welcome: 'স্বাগতম',
    balance: 'আপনার ব্যালেন্স',
    coins: 'কয়েন',
    tap: 'ট্যাপ করুন',
    ready: 'খেলার জন্য প্রস্তুত?',
    tapSuccess: 'কয়েন পেয়েছেন!',
    tasks: 'টাস্ক',
    referrals: 'রেফারেল',
    dailyReward: 'দৈনিক পুরস্কার',
    loading: 'লোড হচ্ছে...',
    error: 'একটি সমস্যা হয়েছে।',
    language: 'ভাষা'
  }
};

let currentLanguage = getLocalData('language', 'en');

if (!translations[currentLanguage]) {
  currentLanguage = 'en';
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(language) {
  if (!translations[language]) {
    throw new Error('Unsupported language.');
  }

  currentLanguage = language;
  saveLocalData('language', language);

  return currentLanguage;
}

export function translate(key) {
  return (
    translations[currentLanguage][key] ||
    translations.en[key] ||
    key
  );
}

export function getTranslations() {
  return { ...translations[currentLanguage] };
}
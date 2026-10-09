import { Telegraf } from 'telegraf';
import config from './config.js';
import {
  createUser,
  getUser
} from './userService.js';

let bot = null;

export function createBot() {
  if (!config.telegram.botToken) {
    console.log(
      'BOT_TOKEN নেই — Telegram bot এখনো চালু করা হবে না।'
    );

    return null;
  }

  bot = new Telegraf(config.telegram.botToken);

  bot.start(async (ctx) => {
    try {
      const user = await createUser(ctx.from);

      await ctx.reply(
        `👋 স্বাগতম ${user.firstName || 'বন্ধু'}!\n\n` +
        `🪙 তোমার Balance: ${user.coins}\n` +
        `⚡ Energy: ${user.energy}/${user.maxEnergy}\n` +
        `⭐ Level: ${user.level}\n\n` +
        `🚀 Mini App থেকে Tap-to-Earn শুরু করো।`
      );
    } catch (error) {
      console.error('Start command error:', error.message);

      await ctx.reply(
        '❌ এখন রেজিস্ট্রেশন করা যাচ্ছে না। পরে আবার চেষ্টা করো।'
      );
    }
  });

  bot.command('balance', async (ctx) => {
    try {
      const user = await getUser(String(ctx.from.id));

      if (!user) {
        return ctx.reply(
          'আগে /start দিয়ে রেজিস্ট্রেশন করো।'
        );
      }

      await ctx.reply(
        `🪙 Balance: ${user.coins || 0}\n` +
        `⚡ Energy: ${user.energy || 0}/${user.maxEnergy || 1000}\n` +
        `⭐ Level: ${user.level || 1}\n` +
        `✨ XP: ${user.xp || 0}`
      );
    } catch (error) {
      console.error('Balance error:', error.message);

      await ctx.reply(
        '❌ Balance দেখাতে সমস্যা হয়েছে।'
      );
    }
  });

  bot.command('id', async (ctx) => {
    await ctx.reply(
      `🆔 তোমার Telegram ID:\n\n${ctx.from.id}`
    );
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      `📚 Available Commands\n\n` +
      `/start - বট শুরু\n` +
      `/balance - Balance দেখুন\n` +
      `/id - Telegram ID দেখুন\n` +
      `/help - Help`
    );
  });

  bot.catch((error) => {
    console.error(
      'Telegram bot error:',
      error.message
    );
  });

  return bot;
}

export function getBot() {
  return bot;
}
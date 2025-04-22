// Плагин для работы с Telegram WebApp API (только на клиенте)
import { defineNuxtPlugin } from '#app';
import type { TelegramWebApp } from '~/types/telegram';

export default defineNuxtPlugin((nuxtApp) => {
  // Этот код выполнится только в браузере
  if (process.client) {
    const telegramApp = window.Telegram?.WebApp;

    // Проверяем, что Telegram WebApp доступен
    if (!telegramApp) {
      console.error('Telegram WebApp не доступен. Убедитесь, что приложение открыто через Telegram.');
      return;
    }

    // Сообщаем Telegram, что приложение готово
    telegramApp.ready();
    
    // Разворачиваем приложение на всю высоту
    telegramApp.expand();

    // Предоставляем доступ к Telegram WebApp через метод provide
    return {
      provide: {
        telegram: telegramApp as TelegramWebApp
      }
    };
  }
}); 
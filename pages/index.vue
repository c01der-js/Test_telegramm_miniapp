<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { useUserStore } from '~/stores/user';
import type { TelegramUser, TelegramWebApp } from '~/types/telegram';

const { $telegram } = useNuxtApp();
const userStore = useUserStore();

const isLoading = ref(true);
const error = ref<string | null>(null);
const telegramReady = ref(false);

// Store viewport handler to remove it later
let viewportHandler: (() => void) | null = null;

onMounted(async () => {
  try {
    // Проверяем, доступен ли Telegram WebApp
    if (!$telegram) {
      error.value = 'Telegram WebApp не инициализирован. Откройте приложение через Telegram.';
      isLoading.value = false;
      return;
    }
    
    // Получаем данные пользователя
    const telegramApp = $telegram as TelegramWebApp;
    
    // Сообщаем Telegram, что наше приложение готово
    telegramApp.ready();
    
    // Расширяем приложение на всю высоту (помогает с мобильным отображением)
    telegramApp.expand();
    
    telegramReady.value = true;
    
    const telegramUser = telegramApp.initDataUnsafe.user;
    
    if (!telegramUser) {
      error.value = 'Не удалось получить информацию о пользователе. Пожалуйста, попробуйте еще раз.';
      isLoading.value = false;
      return;
    }
    
    // Сохраняем данные пользователя в хранилище
    userStore.setUser({
      id: telegramUser.id,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
      avatarUrl: telegramUser.photo_url
    });
    
    isLoading.value = false;
    
    // Настройка адаптации к ViewPort для мобильных устройств
    setupViewportHandling();
  } catch (err) {
    console.error('Ошибка при получении данных пользователя:', err);
    error.value = 'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте еще раз.';
    isLoading.value = false;
  }
});

// Clean up event listeners on unmount
onUnmounted(() => {
  if (window.visualViewport && viewportHandler) {
    window.visualViewport.removeEventListener('resize', viewportHandler);
    window.visualViewport.removeEventListener('scroll', viewportHandler);
  }
  // Add cleanup for iOS resize listener if needed
});

// Функция для настройки обработки видимой области на мобильных устройствах
const setupViewportHandling = () => {
  // Для iOS устройств
  if (window.navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    // Устанавливаем стартовую высоту видимой области
    document.documentElement.style.setProperty(
      '--app-height', 
      `${window.innerHeight}px`
    );
    
    // Обработчик изменения размера окна
    const iosResizeHandler = () => {
      document.documentElement.style.setProperty(
        '--app-height', 
        `${window.innerHeight}px`
      );
    };
    window.addEventListener('resize', iosResizeHandler);
    // Remember to remove this listener in onUnmounted if you keep it
  }
  
  // Обработка визуального вьюпорта (если поддерживается)
  if (window.visualViewport) {
    viewportHandler = () => {
      // Добавляем проверку на null для безопасности
      const visualViewport = window.visualViewport;
      if (!visualViewport) return;

      // Вычисляем смещение клавиатуры
      const keyboardHeight = window.innerHeight - visualViewport.height;
      
      // Если клавиатура видна (высота больше минимального порога)
      // Используем меньший порог, чтобы не реагировать на незначительные изменения
      if (keyboardHeight > 100) {
        // Устанавливаем CSS переменную, но не используем трансформации
        document.documentElement.style.setProperty(
          '--keyboard-offset', 
          `${keyboardHeight}px`
        );
        // Добавляем класс для визуальных изменений
        document.body.classList.add('keyboard-visible');
      } else {
        // Сбрасываем CSS переменную
        document.documentElement.style.removeProperty('--keyboard-offset');
        // Удаляем класс
        document.body.classList.remove('keyboard-visible');
      }
    };
    
    window.visualViewport.addEventListener('resize', viewportHandler);
    window.visualViewport.addEventListener('scroll', viewportHandler);
  }
};
</script>

<template>
  <div class="profile-page">
    <div v-if="isLoading" class="loading-container">
      <p>Загрузка...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
    </div>
    
    <div v-else-if="userStore.user" class="profile-container">
      <!-- Верхняя часть с именем пользователя и кнопкой копирования -->
      <header class="profile-header">
        <UserName />
      </header>
      
      <!-- Центральная часть с аватаром -->
      <main class="profile-content">
        <UserAvatar />
      </main>
      
      <!-- Нижняя часть с формой изменения имени -->
      <footer class="profile-footer">
        <ProfileForm />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  /* Use min-height and let content grow */
  min-height: var(--app-height, 100vh);
  padding: 1rem;
  position: relative;
  overflow-x: hidden;
  /* Allow vertical scroll */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* Adjust height */
  flex-grow: 1;
  min-height: 200px;
}

.error-message {
  color: #d32f2f;
  text-align: center;
  padding: 1rem;
}

.profile-container {
  display: flex;
  flex-direction: column;
  /* Let container grow */
  flex-grow: 1;
  min-height: 0; /* Override min-height if needed */
}

.profile-header {
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  /* Allow header to shrink if needed */
  flex-shrink: 0;
}

.profile-content {
  flex-grow: 1; /* Allow content to take up space */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0; /* Уменьшаем отступ для сжатия страницы */
  min-height: 150px; /* Ensure minimum height */
}

.profile-footer {
  padding: 0.5rem 0; /* Уменьшаем отступ сверху и снизу */
  position: relative;
  z-index: 5;
  flex-shrink: 0;
  margin-top: 0; /* Убираем отступ сверху для более плотного размещения */
}

/* Стили для темной темы Telegram */
@media (prefers-color-scheme: dark) {
  .profile-header {
    border-bottom-color: #444;
  }
  .profile-page {
     background-color: var(--background-color); /* Ensure dark background */
  }
}

/* Стили для мобильных устройств */
@media (max-width: 768px) {
  .profile-footer {
    /* Используем фиксированный отступ снизу */
    padding-bottom: 1rem;
    /* При необходимости учитываем безопасную зону */
    padding-bottom: env(safe-area-inset-bottom, 1rem);
  }
  
  /* Пересмотренная обработка клавиатуры */
  :global(body.keyboard-visible) .profile-content {
    /* Вместо полного скрытия, просто уменьшаем видимость */
    opacity: 0.2;
    transition: opacity 0.3s ease;
    /* Уменьшаем высоту контента при отображении клавиатуры */
    max-height: 100px;
    overflow: hidden;
  }

  /* Не фиксируем заголовок */
  :global(body.keyboard-visible) .profile-header {
    /* Убираем фиксированное позиционирование */
    padding: 0.5rem 1rem;
    opacity: 0.7;
  }
}
</style> 
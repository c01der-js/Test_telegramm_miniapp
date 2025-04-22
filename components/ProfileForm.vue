<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

// Состояние формы
const newName = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isKeyboardActive = ref(false);
const formRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// Инициализация формы при монтировании
watch(() => userStore.user, (newUser) => {
  if (newUser) {
    newName.value = userStore.fullName;
  }
}, { immediate: true });

// Валидация имени
const validateName = (name: string): boolean => {
  if (!name.trim()) {
    errorMessage.value = 'Имя не может быть пустым';
    return false;
  }
  
  if (name.trim().length < 2) {
    errorMessage.value = 'Имя должно содержать не менее 2 символов';
    return false;
  }
  
  if (name.trim().length > 50) {
    errorMessage.value = 'Имя должно содержать не более 50 символов';
    return false;
  }
  
  return true;
};

// Обработка сохранения имени
const saveName = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  
  // Валидация ввода
  if (!validateName(newName.value)) {
    return;
  }
  
  // Скрываем клавиатуру для лучшего UX перед отправкой
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  
  isSubmitting.value = true;
  
  try {
    // Разделение полного имени на имя и фамилию
    const nameParts = newName.value.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;
    
    // Обновление имени в хранилище
    const success = await userStore.updateName(firstName, lastName);
    
    if (success) {
      successMessage.value = 'Имя успешно обновлено';
      // Очистка сообщения об успехе через 3 секунды
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      errorMessage.value = userStore.error || 'Не удалось обновить имя';
    }
  } catch (error) {
    console.error('Ошибка при обновлении имени:', error);
    errorMessage.value = 'Произошла ошибка при обновлении имени';
  } finally {
    isSubmitting.value = false;
  }
};

// Определяем, является ли устройство мобильным
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Обновление CSS-переменной --vh
const updateVH = () => {
  if (window.visualViewport) {
    const vh = window.visualViewport.height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
};

// Обработка фокуса на поле ввода
const handleFocus = () => {
  // Сначала разворачиваем Telegram WebApp до максимальной высоты
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand();
  }
  
  isKeyboardActive.value = true;
  
  // Даем немного времени для завершения разворачивания
  setTimeout(() => {
    if (!inputRef.value || !formRef.value) return;
    
    // Прокручиваем к инпуту и центрируем его
    inputRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    
    // Рассчитываем и устанавливаем высоту клавиатуры как padding-bottom
    if (window.visualViewport) {
      const keyboardHeight = window.innerHeight - window.visualViewport.height;
      if (keyboardHeight > 50) {
        document.documentElement.style.setProperty('--keyboard-offset', `${keyboardHeight}px`);
      }
    }
    
    // Обновляем переменную --vh
    updateVH();
  }, 150);
};

// Обработка потери фокуса
const handleBlur = () => {
  isKeyboardActive.value = false;
  document.documentElement.style.removeProperty('--keyboard-offset');
};

// Обработчик для клика вне инпута
const handleClickOutside = (e: MouseEvent | TouchEvent) => {
  if (!inputRef.value || !formRef.value) return;
  
  // Проверяем, что клик был не по инпуту и не по форме
  const target = e.target as HTMLElement;
  const isInput = target.closest('input') !== null;
  const isButton = target.closest('button') !== null;
  const isFormElement = formRef.value.contains(target);
  
  // Только если клик был вне формы и инпут имеет фокус
  if (!isInput && !isButton && !isFormElement && document.activeElement === inputRef.value) {
    // Убираем фокус с инпута, чтобы скрыть клавиатуру
    inputRef.value.blur();
  }
};

// Хук для обработки изменения размера окна
onMounted(() => {
  // Инициализация Telegram WebApp если доступен
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
  
  // Обновляем --vh при монтировании
  updateVH();
  
  // Подписываемся на изменения размера viewport
  window.visualViewport?.addEventListener('resize', handleViewportResize);
  window.addEventListener('resize', updateVH);
  window.addEventListener('orientationchange', updateVH);
  
  // Добавляем обработчики для клика вне инпута
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside);
});

onUnmounted(() => {
  window.visualViewport?.removeEventListener('resize', handleViewportResize);
  window.removeEventListener('resize', updateVH);
  window.removeEventListener('orientationchange', updateVH);
  
  // Удаляем обработчики для клика вне инпута
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('touchstart', handleClickOutside);
});

// Обработчик изменения размера видимой области
const handleViewportResize = () => {
  if (!window.visualViewport) return;

  // Обновляем --vh при изменении размера
  updateVH();
  
  // Определяем появление клавиатуры
  const isKeyboardShown = window.visualViewport.height < window.innerHeight * 0.9;
  
  if (isKeyboardShown && inputRef.value && document.activeElement === inputRef.value) {
    // Если клавиатура показана и инпут в фокусе
    
    // Устанавливаем CSS переменную для смещения от клавиатуры
    const keyboardHeight = window.innerHeight - window.visualViewport.height;
    document.documentElement.style.setProperty('--keyboard-offset', `${keyboardHeight}px`);
    document.body.classList.add('keyboard-visible');
    
    // Плавно прокручиваем к инпуту
    if (inputRef.value) {
      inputRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  } else {
    // Клавиатура скрыта или инпут не в фокусе
    document.documentElement.style.removeProperty('--keyboard-offset');
    document.body.classList.remove('keyboard-visible');
  }
};
</script>

<template>
  <div
    ref="formRef"
    class="profile-form keyboard-helper"
    :class="{ 'keyboard-active': isKeyboardActive }"
  >
    <h3>Изменить имя</h3>
    
    <form @submit.prevent="saveName" class="form-container">
      <div class="form-group">
        <input
          ref="inputRef"
          v-model="newName"
          type="text"
          placeholder="Введите новое имя"
          class="form-input"
          autocomplete="name"
          @focus="handleFocus"
          @blur="handleBlur"
        >
      </div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <button 
        type="submit" 
        class="submit-button" 
        :disabled="isSubmitting"
        @click="saveName"
      >
        <span v-if="isSubmitting">Обновление...</span>
        <span v-else>Обновить имя</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.profile-form {
  margin-top: 0.5rem; /* Уменьшаем отступ сверху, чтобы форма была ближе к аватару */
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, padding 0.2s ease;
}

/* Стиль при активной клавиатуре - более мягкий подход */
.profile-form.keyboard-active {
  position: relative;
  z-index: 100;
  transform: translateY(-20px); /* Небольшая трансформация вверх */
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.form-container {
  display: flex;
  flex-direction: column;
}

h3 {
  margin-top: 0;
  text-align: center;
  margin-bottom: 1rem; /* Уменьшаем отступ заголовка */
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px; /* Предотвращает зум на iOS */
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #0088cc;
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 0.5rem; /* Уменьшаем отступ кнопки */
}

.submit-button:disabled {
  background-color: #94c6e0;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  background-color: #006699;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.success-message {
  color: #388e3c;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

/* Стили для темной темы Telegram */
@media (prefers-color-scheme: dark) {
  .profile-form {
    background-color: #222;
  }
  
  h3 {
    color: #f5f5f5;
  }
  
  .form-input {
    background-color: #333;
    color: #f5f5f5;
    border-color: #444;
  }
}

/* Стили для мобильных устройств */
@media (max-width: 768px) {
  .profile-form {
    margin-top: 0; /* Убираем отступ сверху на мобильных */
    margin-bottom: calc(env(safe-area-inset-bottom, 0) + 10px);
    padding: 0.75rem;
    position: relative;
  }
  
  /* Смягченное поведение при активной клавиатуре */
  .profile-form.keyboard-active {
    transform: translateY(-10px);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  /* Уменьшаем размер элементов формы на мобильных */
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .form-input {
    padding: 0.5rem;
  }
  
  .submit-button {
    padding: 0.5rem;
    margin-top: 0.5rem;
  }
}
</style> 
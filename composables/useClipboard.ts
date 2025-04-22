import { ref } from 'vue';

export const useClipboard = () => {
  const copied = ref(false);
  const copyError = ref<string | null>(null);

  // Функция копирования текста в буфер обмена
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;
      copyError.value = null;
      
      // Сбрасываем статус через 2 секунды
      setTimeout(() => {
        copied.value = false;
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Ошибка при копировании в буфер обмена:', error);
      copyError.value = 'Не удалось скопировать текст';
      
      // Показываем пользователю сообщение об ошибке
      alert('Не удалось скопировать текст. Возможно, отсутствуют разрешения.');
      
      return false;
    }
  };

  return {
    copied,
    copyError,
    copyToClipboard
  };
}; 
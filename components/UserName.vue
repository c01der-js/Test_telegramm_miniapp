<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { useClipboard } from '~/composables/useClipboard';

const userStore = useUserStore();
const { copied, copyToClipboard } = useClipboard();

// Функция копирования имени
const copyName = () => {
  if (userStore.fullName) {
    copyToClipboard(userStore.fullName);
  }
};
</script>

<template>
  <div class="user-name">
    <h2 class="name-text">{{ userStore.fullName }}</h2>
    <button class="copy-button" @click="copyName" aria-label="Копировать имя">
      <span v-if="copied" class="copied-text">Скопировано!</span>
      <template v-else>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </template>
    </button>
  </div>
</template>

<style scoped>
.user-name {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
}

.name-text {
  font-size: 1.5rem;
  margin: 0;
  padding-right: 0.5rem;
}

.copy-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #0088cc;
  padding: 0.3rem;
  display: flex;
  align-items: center;
}

.copy-button:hover {
  color: #005580;
}

.copied-text {
  font-size: 0.75rem;
  color: #4caf50;
}
</style> 
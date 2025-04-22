<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

// Определяем URL аватара или плейсхолдер
const avatarUrl = computed(() => {
  return userStore.user?.avatarUrl || '/default-avatar.png';
});

// Создаем инициалы для плейсхолдера, если нет аватара
const initials = computed(() => {
  if (!userStore.user) return '';
  
  const firstName = userStore.user.firstName.charAt(0) || '';
  const lastName = userStore.user.lastName?.charAt(0) || '';
  
  return (firstName + lastName).toUpperCase();
});

// Проверяем, есть ли у пользователя аватар
const hasAvatar = computed(() => !!userStore.user?.avatarUrl);
</script>

<template>
  <div class="user-avatar">
    <img v-if="hasAvatar" :src="avatarUrl" :alt="userStore.fullName" class="avatar-image" />
    <div v-else class="avatar-placeholder">
      {{ initials }}
    </div>
  </div>
</template>

<style scoped>
.user-avatar {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0088cc;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #0088cc;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: bold;
}
</style> 
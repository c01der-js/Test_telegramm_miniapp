import { defineStore } from 'pinia';

export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoading: false,
    error: null
  }),

  getters: {
    fullName(): string {
      if (!this.user) return '';
      return `${this.user.firstName} ${this.user.lastName || ''}`.trim();
    },
    
    isAuthenticated(): boolean {
      return !!this.user;
    }
  },

  actions: {
    setUser(userData: User) {
      this.user = userData;
    },
    
    async updateName(firstName: string, lastName?: string) {
      if (!this.user) return false;
      
      this.isLoading = true;
      this.error = null;
      
      try {
        return new Promise<boolean>((resolve) => {
          setTimeout(() => {
            if (this.user) {
              this.user = {
                ...this.user,
                firstName,
                lastName: lastName || this.user.lastName
              };
              this.isLoading = false;
              resolve(true);
            } else {
              this.error = 'Пользователь не найден';
              this.isLoading = false;
              resolve(false);
            }
          }, 300); 
        });
      } catch (error) {
        this.error = 'Ошибка при обновлении имени';
        this.isLoading = false;
        return false;
      }
    },
    
    clearUser() {
      this.user = null;
    },
    
    setError(message: string) {
      this.error = message;
    }
  }
}); 
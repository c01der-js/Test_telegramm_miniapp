# Telegram Mini App - Профиль пользователя

Telegram Mini App для просмотра и редактирования профиля пользователя. Приложение использует Telegram WebApp API для авторизации и отображения данных пользователя.

## Функциональность

- Авторизация через Telegram WebApp API
- Отображение данных пользователя (имя, аватар)
- Возможность копирования имени пользователя
- Форма изменения имени
- Адаптивный интерфейс для мобильных устройств
- Поддержка светлой и темной темы

## Технологический стек

- [Nuxt 3](https://nuxt.com/) - Фреймворк на основе Vue 3
- [TypeScript](https://www.typescriptlang.org/) - Типизированный JavaScript
- [Pinia](https://pinia.vuejs.org/) - Управление состоянием
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) - Для логики компонентов

## Установка и запуск

### Предварительные требования

- Node.js 18+ и npm
- Зарегистрированный бот в Telegram через [@BotFather](https://t.me/BotFather)

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/username/telegram-mini-app.git
cd telegram-mini-app

# Установка зависимостей
npm install
```

### Разработка

```bash
# Запуск сервера разработки на http://localhost:3000
npm run dev
```

### Сборка для продакшн

```bash
# Сборка приложения
npm run build

# Предпросмотр продакшн-сборки
npm run preview
```

## Деплой на Vercel

1. Создайте аккаунт на [Vercel](https://vercel.com/) если у вас его нет
2. Свяжите ваш GitHub/GitLab/Bitbucket репозиторий с Vercel
3. Vercel автоматически определит, что это Nuxt.js проект
4. Нажмите "Deploy" и дождитесь завершения деплоя
5. Скопируйте полученный URL вашего приложения (например, `https://your-app.vercel.app`)

## Настройка Telegram Bot WebApp

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Выполните команду `/newbot` и следуйте инструкциям для создания нового бота
3. После создания бота используйте команду `/mybots`, выберите своего бота
4. В меню бота выберите "Bot Settings" → "Menu Button" → "Configure menu button"
5. Введите текст для кнопки (например, "Профиль")
6. Введите URL вашего приложения: `https://your-app.vercel.app`
7. Вернитесь в меню бота и выберите "Edit Commands"
8. Добавьте команду `profile - Открыть профиль` для доступа к приложению через команду

## Тестирование

1. Откройте вашего бота в Telegram
2. Нажмите на кнопку меню или отправьте команду `/profile`
3. Приложение должно открыться внутри Telegram

## Разработка

Проект имеет следующую структуру:

- `assets/css/main.css` - Глобальные стили
- `components/` - Переиспользуемые компоненты (UserAvatar, UserName, ProfileForm)
- `composables/` - Переиспользуемая логика (useClipboard)
- `pages/` - Страницы приложения
- `plugins/` - Плагины (Telegram WebApp)
- `stores/` - Хранилище данных Pinia
- `types/` - TypeScript типы и интерфейсы

## Лицензия

MIT

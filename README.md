# Photographer Portfolio

Современный сайт-портфолио для фотографа с админ-панелью. Vite + React + TypeScript.

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется на `http://localhost:5173`

## Демо-доступ к админ-панели

- URL: `/admin`
- Email: `admin@volkova-photo.ru`
- Пароль: `demo123`

## Структура

```
src/
├── components/        # UI компоненты
│   ├── admin/         # Компоненты админки
│   ├── gallery/       # Галерея и сетка
│   ├── layout/        # Header, Footer
│   └── ui/            # Переиспользуемые UI элементы
├── context/           # React Context (Auth)
├── data/              # Моковые данные
├── pages/             # Страницы
│   ├── admin/         # Страницы админки
│   └── *.tsx          # Публичные страницы
├── styles/            # Глобальные стили
└── types/             # TypeScript типы
```

## Страницы

### Публичные
- `/` — Главная
- `/portfolio` — Портфолио
- `/album/:slug` — Альбом
- `/about` — Обо мне
- `/services` — Услуги и цены
- `/booking` — Бронирование
- `/contact` — Контакты

### Админ-панель
- `/admin` — Дашборд
- `/admin/photos` — Управление фото
- `/admin/albums` — Управление альбомами
- `/admin/bookings` — Заявки
- `/admin/settings` — Настройки

## Технологии

- React 18
- TypeScript
- Vite
- React Router DOM 6
- Framer Motion
- CSS Custom Properties

## Особенности

- Адаптивный дизайн
- Lightbox с жестами
- Masonry-сетка с lazy loading
- Многошаговая форма бронирования
- Полноценная админ-панель

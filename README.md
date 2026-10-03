# High-Load URL Availability & Health Checker

> **Автор:** [Александр Булло]  
> **Telegram для связи:** [@AlexanderBullo](https://t.me/AlexanderBullo)  
> **Стек:** Node.js 22, NestJS, TypeScript, React 19, Vite 6, Zustand, Tailwind CSS v4, Docker, Nginx

---

## 👋 Приветствие и философия разработки

Высокопроизводительный асинхронный Fullstack-микросервис для распределенной проверки доступности и мониторинга веб-ресурсов (URL Health Checker). Проект выполнен с упором на Clean Architecture, безопасность памяти долгоживущего процесса и нулевые внешние зависимости в ядре параллелизма.

При проектировании и разработке сервиса я руководствовался принципами **Clean Architecture**, **Security-First** и **Performance-First**, рассматривая проект не как временный прототип, а как надежный фундамент для масштабируемой enterprise-системы.

### Ключевые соображения и выбор решений:

1. **Zero External Concurrency Deps & No DB:**  
   Сознательный отказ от сторонних библиотек (p-limit, bullmq) в пользу собственного AsyncSemaphore на нативных промисах для прямого контроля над Event Loop и минимизации рисков supply chain
2. **Безопасность и управление ресурсами памяти:**  
   In-Memory Storage & Garbage Collection: архитектура оптимизирована под сверхбыстрый отклик O(1) с контролем утечек памяти через автоматический Cron TTL и прерывание AbortController.
3. **Архитектурная дисциплина на фронтенде:**  
   Фронтенд спроектирован по методологии **Feature-Sliced Design (FSD)** с четким разделением слоев (`app`, `widgets`, `features`, `entities`, `shared`), строгой типизацией, глобальным стором Zustand и адаптивным Live Polling, защищенным от race conditions.

---

## 📋 Оглавление

1. [Архитектурный обзор системы](#-архитектурный-обзор-системы)
2. [Обоснование инженерных решений (Trade-offs)](#-обоснование-инженерных-решений-trade-offs)
   - [2.1 Backend: NestJS vs Fastify / Express](#21-backend-nestjs-vs-fastify--express)
   - [2.2 Concurrency: Кастомный AsyncSemaphore vs p-limit](#22-concurrency-кастомный-asyncsemaphore-vs-p-limit)
   - [2.3 Хранилище: In-Memory Map с Cron TTL vs Redis / PostgreSQL](#23-хранилище-in-memory-map-с-cron-ttl-vs-redis--postgresql)
   - [2.4 Frontend: Feature-Sliced Design vs Монолитная структура](#24-frontend-feature-sliced-design-vs-монолитная-структура)
   - [2.5 UI/UX & Transport: Smart Polling с Abort-on-Switch vs WebSockets](#25-uiux--transport-smart-polling-с-abort-on-switch-vs-websockets)
3. [Быстрый запуск в Docker](#-быстрый-запуск-в-docker)
4. [Локальная разработка](#-локальная-разработка)
5. [Спецификация REST API](#-спецификация-rest-api)
   - [5.1 Создание задачи (`POST /api/jobs`)](#51-создание-задачи-post-apijobs)
   - [5.2 Список всех задач (`GET /api/jobs`)](#52-список-всех-задач-get-apijobs)
   - [5.3 Детальная информация о задаче (`GET /api/jobs/:id`)](#53-детальная-информация-о-задаче-get-apijobsid)
   - [5.4 Отмена выполнения задачи (`DELETE /api/jobs/:id`)](#54-отмена-выполнения-задачи-delete-apijobsid)
   - [5.5 Стандартизированный формат ошибок](#55-стандартизированный-формат-ошибок)
   - [5.6 Rate Limiting (Защита от DoS)](#56-rate-limiting-защита-от-dos)
6. [Особенности UI/UX и Дизайн-система Altitude](#-особенности-uiux-и-дизайн-система-altitude)
7. [Тестирование и проверка качества](#-тестирование-и-проверка-качества)
8. [Чек-лист готовности к защите](#-чек-лист-готовности-к-защите)

---

## 🏛 Архитектурный обзор системы

Система построена по принципу разделения на BFF (Backend For Frontend) API-слой и клиентское SPA-приложение.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                FRONTEND (React 19 + TypeScript)                         │
│                                                                                        │
│  [CreateJobForm] ──────> (POST /api/jobs) ────────> [useJobStore] <────┐               │
│                                                          │             │               │
│  [JobDetails]    <────── (GET /api/jobs/:id) <───────────┤ (Polling    │ (ID Guard &   │
│  [JobList]       <────── (GET /api/jobs)     <───────────┘ 1000ms Loop)│ AbortSignal)  │
└──────────────────────────────────────────────────────────┬─────────────┼───────────────┘
                                                           │             │
                                                    HTTP / REST          │
                                                           │             │
┌──────────────────────────────────────────────────────────▼─────────────┴───────────────┐
│                                 BACKEND (NestJS Core)                                  │
│                                                                                        │
│  [JobsController] ──> ValidationPipe & ThrottlerGuard (SSRF & Rate Limit Protection)   │
│         │                                                                              │
│  [JobsService]    ──> Map<string, Job> (In-Memory O(1) Lookup Storage)                  │
│         │         ──> Cron Cleanup Service (EVERY_HOUR TTL 24h Purge)                  │
│         │                                                                              │
│         └─── Async Job Pipeline (Background Non-Blocking Event Loop)                   │
│                  │                                                                     │
│                  ├──> [AsyncSemaphore(5)] ──> Limiter (Max 5 Concurrent Fetch Tasks)   │
│                  │                                                                     │
│                  └──> [checkUrl()] ─────────> Combined AbortSignal (Job + Timeout 5s)  │
│                                             ──> Native fetch(HEAD) Request             │
│                                             ──> Random Artificial Delay (0-10s)        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💡 Обоснование инженерных решений (Trade-offs)

### 2.1 Backend: NestJS vs Fastify / Express

- **Рассматриваемые варианты:** Чистый Express.js, Fastify, NestJS.
- **Принятое решение:** **NestJS** (на платформе Express).
- **Обоснование:**
  - **Dependency Injection & Inversion of Control:** Четкое разделение контроллеров, сервисов, пайпов и фильтров. Исключает спагетти-код и упрощает unit-тестирование моками.
  - **Декларативная валидация:** `class-validator` и `ValidationPipe` на уровне DTO гарантируют, что ни один некорректный URL или опасная схема (`javascript:`, `file:`) не дойдет до бизнес-логики.
  - **Встроенная инфраструктура:** Из коробки доступны `@nestjs/throttler` (Rate Limiting) и `@nestjs/schedule` (Cron-задачи).

### 2.2 Concurrency: Кастомный AsyncSemaphore vs p-limit

- **Рассматриваемые варианты:** `p-limit`, `async.queue`, BullMQ, самописный семафор.
- **Принятое решение:** **Кастомный класс `AsyncSemaphore` на чистом TypeScript**.
- **Обоснование:**
  - **Глубокое понимание асинхронной модели JS:** Семафор реализован на очереди промисов (`Array<() => void>`) с честным порядком обработки FIFO (First-In, First-Out).
  - **Zero Dependencies:** Нулевой риск уязвимостей в цепочке поставок (supply chain attacks).
  - **Строгая изоляция:** Лимит в 5 параллельных запросов инкапсулирован на уровне выполнения каждой задачи, не создавая взаимных блокировок между разными Job ID.

### 2.3 Хранилище: In-Memory Map с Cron TTL vs Redis / PostgreSQL

- **Рассматриваемые варианты:** PostgreSQL, SQLite, Redis, In-Memory `Map<string, Job>`.
- **Принятое решение:** **In-Memory `Map` + `@Cron(CronExpression.EVERY_HOUR)`**.
- **Обоснование:**
  - **Максимальная производительность:** Доступ к задаче по ключу $O(1)$ без накладных расходов на сетевые сокеты и сериализацию/десериализацию.
  - **Защита от утечек памяти (Memory Leaks):** При долгой работе сервера `createdTimestamps` отслеживает возраст каждой задачи. Ежечасный крон удаляет записи старше 24 часов и вызывает `.abort()` у связанных контроллеров, гарантируя освобождение ссылок для Garbage Collector (V8).

### 2.4 Frontend: Feature-Sliced Design vs Монолитная структура

- **Рассматриваемые варианты:** Плоская структура компонентов, классический MVC, Feature-Sliced Design (FSD).
- **Принятое решение:** **Feature-Sliced Design (FSD)**.
- **Обоснование:**
  - **Строгие границы модулей:** Разделение на `app`, `widgets`, `features`, `entities`, `shared` предотвращает циклические зависимости и хаотичные импорты.
  - **Масштабируемость:** Любой компонент (например, форму создания или таблицу результатов) можно легко дорабатывать, тестировать и переиспользовать в изоляции.
  - **Zustand State Engine:** Легковесный менеджер состояния с избирательным сохранением `activeJobId` в `localStorage` (через `partialize`).

### 2.5 UI/UX & Transport: Smart Polling с Abort-on-Switch vs WebSockets

- **Рассматриваемые варианты:** WebSockets, Server-Sent Events (SSE), Interval Polling.
- **Принятое решение:** **Adaptive Polling (1000ms) с отменой запросов через `AbortController`**.
- **Обоснование:**
  - **Простота и надежность:** Не требует поддержки постоянных сокетов и сложного механизма реконнекта на бэкенде.
  - **Page Visibility API:** Автоматическая приостановка опроса при сворачивании вкладки (`document.hidden`) экономит батарею устройства и сетевой трафик.
  - **Race Condition Guard:** При переключении пользователем между задачами предыдущий HTTP-запрос отменяется по `AbortSignal`, а ответ валидируется по `activeJobId`.

---

## 🚀 Быстрый запуск в Docker

Проект полностью контейнеризирован и запускается одной командой:

```bash
docker compose up --build
```

### Доступные сервисы:

- **Frontend SPA:** [http://localhost](http://localhost) (или `http://localhost:80`)
- **Backend REST API:** [http://localhost:3000](http://localhost:3000)

### Остановка контейнеров:

```bash
docker compose down
```

---

## 💻 Локальная разработка

### Требования:

- Node.js >= 22.x
- npm >= 10.x

### 1. Запуск Backend:

```bash
cd backend
npm install
npm run start:dev
```

API запустится на `http://localhost:3000`.

### 2. Запуск Frontend:

```bash
cd frontend
npm install
npm run dev
```

Клиентское приложение запустится на `http://localhost:5173`.

---

## 📡 Спецификация REST API

### 5.1 Создание задачи (`POST /api/jobs`)

Принимает список URL-адресов для асинхронной проверки.

- **URL:** `/api/jobs`
- **Метод:** `POST`
- **Тело запроса (JSON):**

```json
{
  "urls": [
    "https://google.com",
    "https://github.com",
    "https://invalid-non-existent-domain.org"
  ]
}
```

- **Успешный ответ (201 Created):**

```json
{
  "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 5.2 Список всех задач (`GET /api/jobs`)

Возвращает список всех созданных задач со сводными счетчиками по статусам.

- **URL:** `/api/jobs`
- **Метод:** `GET`
- **Успешный ответ (200 OK):**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "createdAt": "2026-08-15T12:00:00.000Z",
    "status": "in_progress",
    "total": 3,
    "pending": 1,
    "in_progress": 1,
    "completed": 1,
    "failed": 0,
    "cancelled": 0
  }
]
```

---

### 5.3 Детальная информация о задаче (`GET /api/jobs/:id`)

Возвращает подробный статус задачи с результатами проверки каждого конкретного URL.

- **URL:** `/api/jobs/:id`
- **Метод:** `GET`
- **Успешный ответ (200 OK):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "createdAt": "2026-08-15T12:00:00.000Z",
  "status": "completed",
  "items": [
    {
      "url": "https://google.com",
      "status": "completed",
      "httpCode": 200,
      "duration": 412
    },
    {
      "url": "https://github.com",
      "status": "completed",
      "httpCode": 200,
      "duration": 850
    },
    {
      "url": "https://invalid-non-existent-domain.org",
      "status": "failed",
      "duration": 120
    }
  ]
}
```

---

### 5.4 Отмена выполнения задачи (`DELETE /api/jobs/:id`)

Мгновенно прерывает активные сетевые запросы через `AbortController` и переводит незавершенные элементы в статус `cancelled`.

- **URL:** `/api/jobs/:id`
- **Метод:** `DELETE`
- **Успешный ответ (200 OK):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "createdAt": "2026-08-15T12:00:00.000Z",
  "status": "cancelled",
  "items": [
    {
      "url": "https://google.com",
      "status": "completed",
      "httpCode": 200,
      "duration": 412
    },
    {
      "url": "https://github.com",
      "status": "cancelled"
    }
  ]
}
```

---

### 5.5 Стандартизированный формат ошибок

Все ошибки приложения (валидация, 404, 429, 500) нормализуются через глобальный `HttpExceptionFilter`:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "urls must contain at least 1 elements",
    "each url must be a valid http or https URL"
  ],
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

---

### 5.6 Rate Limiting (Защита от DoS)

- Включен `@nestjs/throttler`: максимум **30 запросов в минуту** с одного IP.
- При превышении лимита возвращается HTTP-код `429 Too Many Requests`.

---

## 🎨 Особенности UI/UX и Дизайн-система Altitude

Интерфейс спроектирован в авторской эстетике **Altitude (Midnight Financial Editorial)**:

- **Цветовая палитра:** Глубокий темно-угольный фон (`#181818`, `#1f1f1f`) с контрастным костяным текстом (`#eeeeee`) и акцентным синим цветом (`#2b7fff`).
- **Типографика:** Элегантный акцидентный шрифт с засечками **Libre Baskerville** для заголовков, системный **Inter** для интерфейса и **Fira Code** для моноширинных данных.
- **Мульти-сегментный прогресс-бар:** Динамическое визуальное отображение долей статусов (`completed`, `in_progress`, `failed`, `cancelled`, `pending`) в реальном времени.
- **Удобство копирования (`CopyButton`):** Мгновенное копирование UUID задачи и URL в буфер обмена с индикатором «Скопировано!».
- **Мобильная адаптивность:** Полнофункциональный интерфейс на смартфонах и планшетах с таб-навигацией переключения между формой/списком и деталями задачи.

---

## 🧪 Тестирование и проверка качества

### 1. Запуск Unit и Concurrency тестов:

```bash
cd backend
npm test
```

_Тестовый набор проверяет:_

- Строгое соблюдение лимита в 5 параллельных потоков у `AsyncSemaphore`.
- Корректную отработку `AbortController` и каскадную отмену статусов.
- Работу Cron TTL очистки старых задач без утечек памяти.

### 2. Линтинг и валидация типов:

```bash
# Backend
cd backend && npm run lint && npm run build

# Frontend
cd frontend && npm run lint && npm run build
```

---

## 🛡 Архитектурный чек-лист и критерии надежности системы

| Требование ТЗ / Архитектурный критерий | Реализация в проекте                                 | Статус       |
| -------------------------------------- | ---------------------------------------------------- | ------------ |
| **Max Concurrency = 5**                | Кастомный `AsyncSemaphore` на промисах (FIFO)        | ✅ Выполнено |
| **Native HEAD requests**               | `fetch(url, { method: 'HEAD', signal })`             | ✅ Выполнено |
| **Timeout 5s & Delay 0–10s**           | `AbortSignal.timeout(5000)` + `sleep(delay, signal)` | ✅ Выполнено |
| **Cascading Cancellation**             | `DELETE /api/jobs/:id` через `AbortController`       | ✅ Выполнено |
| **In-Memory Storage & Clean**          | `Map<string, Job>` + Cron 24h TTL Cleanup            | ✅ Выполнено |
| **Strict URL Validation**              | `CreateJobDto` (`http://` и `https://` only)         | ✅ Выполнено |
| **Rate Limiting**                      | `@nestjs/throttler` (30 req / min)                   | ✅ Выполнено |
| **Global Error Format**                | Единый `HttpExceptionFilter`                         | ✅ Выполнено |
| **Frontend Architecture**              | Feature-Sliced Design + Zustand + React 19           | ✅ Выполнено |
| **Docker & Compose**                   | Multi-stage Dockerfiles + Nginx Reverse Proxy        | ✅ Выполнено |


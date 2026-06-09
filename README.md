# cocode

**Collaborative code editor** — проект, разработанный двумя студентами НИЯУ МИФИ в ходе научно-исследовательской работы. Представляет собой веб-приложение для совместного редактирования кода в реальном времени с поддержкой компиляции/интерпретации на нескольких языках.

## Технологический стек

| Компонент | Технология |
|-----------|-----------|
| **Backend** | Go (net/http, html/template) |
| **База данных** | SQLite3 (mattn/go-sqlite3) |
| **Аутентификация** | JWT (golang-jwt/jwt/v5), bcrypt |
| **CRDT / Real-time** | Yjs v13 + y-websocket v3 |
| **Редактор кода** | CodeMirror 5 |
| **Сборка фронтенда** | esbuild |
| **Изоляция кода** | Docker (python:3.11-slim) |
| **Деплой** | Docker Compose + Ansible |

## Функциональность

- **Совместное редактирование** — несколько пользователей одновременно могут редактировать один файл. Конфликты разрешаются автоматически благодаря CRDT (Yjs).
- **Поддержка языков** — JavaScript, Go, Python, Java, C++, HTML, CSS, SQL, Markdown, Rust. Подсветка синтаксиса от CodeMirror 5.
- **Выполнение Python** — изолированный запуск кода в Docker-контейнере с ограничением ресурсов (256 MB RAM, 0.5 CPU, без сети, таймаут 6 с). Есть поддержка stdin.
- **Управление сессиями** — создание, удаление и сохранение сессий. Контент сохраняется в SQLite.
- **Коллабораторы** — владелец сессии может добавлять других пользователей для совместной работы.
- **HTML Preview** — для HTML-сессий доступен live-просмотр в iframe.
- **Курсоры соавторов** — цветные индикаторы позиций других участников в реальном времени.
- **IndexedDB** — локальное кеширование Yjs-документа через y-indexeddb.
- **JWT-аутентификация** — регистрация, вход, выход. HttpOnly cookie с expiry 24ч.

## Архитектура

```
Browser (CodeMirror + Yjs Client)
     |                         \
     | HTTP (REST)              | WebSocket (Yjs sync)
     v                          v
+-----------+           +------------------+
| Go Server |           | y-websocket      |
| :8080     |           | :1234 / :8082    |
|           |           |                  |
| handlers  |           | CRDT sync        |
| + SQLite  |           | между клиентами  |
+-----------+           +------------------+

+---------------------+
| Docker sandbox      |  (Python, по запросу)
| python:3.11-slim    |
| --network none      |
| --memory 256m       |
| --cpus 0.5          |
+---------------------+
```

## Быстрый старт

### Требования
- Go 1.24+
- Node.js 20+ + npm
- Docker (для Python-песочницы)

### Локальный запуск

```bash
# зависимости
go mod tidy
npm install

# сборка фронтенда
npm run build

# запуск Go-сервера (терминал 1)
go run .

# запуск Yjs WebSocket сервера (терминал 2)
npx y-websocket --host 0.0.0.0 --port 1234

# открыть http://localhost:8080
```

### Docker Compose

```bash
docker-compose up
```

### Режим разработки (watch)

```bash
npm run watch
```

## Переменные окружения

| Переменная | По умолчанию | Описание |
|-----------|-------------|----------|
| `DB_PATH` | `cocode.db` | Путь к файлу SQLite |
| `JWT_SECRET` | `dev_secret` | Секретный ключ подписи JWT |

## Деплой

Через Ansible:

```bash
./sh_scripts/run_ansible.sh deploy    # деплой на сервер
./sh_scripts/run_ansible.sh stop      # остановка
```

Или вручную:

```bash
ansible-playbook -i ansible/inventory.yml ansible/deploy.yml
ansible-playbook -i ansible/inventory.yml ansible/stop.yml
```

Проект был развёрнут на сервере кафедры по адресу `193.246.144.202`.

## Структура проекта

```
├── main.go                    # Входная точка, маршрутизация
├── handlers.go                # HTTP-обработчики
├── frontend/app.js            # Yjs + CodeMirror интеграция
├── static/style.css           # Стили
├── templates/                 # Go-шаблоны (HTML)
│   ├── base.html
│   ├── dashboard.html
│   ├── editor.html
│   ├── login.html
│   └── register.html
├── docker/python-runner/      # Dockerfile для Python-песочницы
├── ansible/                   # Плейбуки деплоя
├── sh_scripts/                # Вспомогательные скрипты
├── docker-compose.yml
└── Dockerfile
```

## Схема БД

```sql
users (user_id, username, password_hash)
sessions (session_id, owner_id, language, project_name, content)
collabs (session_id, user_id)
```

## API

| Маршрут | Методы | Описание |
|---------|--------|---------|
| `/` | GET | Дашборд (список сессий) |
| `/register` | GET, POST | Регистрация |
| `/login` | GET, POST | Вход (JWT cookie) |
| `/logout` | GET | Выход |
| `/create-session` | POST | Создание сессии |
| `/add-collab` | POST | Добавление коллаборатора |
| `/editor` | GET | Редактор |
| `/interpret` | POST | Запуск Python-кода |
| `/delete-session` | POST | Удаление сессии |
| `/save-session` | POST | Сохранение контента |
| `/static/` | GET | Статические файлы |

WebSocket для Yjs — отдельный сервер `y-websocket` на порту 1234/8082.

## Лицензия

Проект выполнен в учебных целях в НИЯУ МИФИ.

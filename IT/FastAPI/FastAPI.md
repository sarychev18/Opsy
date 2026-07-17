FastAPI - это современный быстрый веб-фреймворк, который служит для создания API, для создания вебсервисов. FastAPI использует аннотации типов для автоматической генерации документации, валидации данных и сериализации. ФастАПИ создана на основе Starlett(низкоуровневый ASGI фреймворк (веб-сервер) и Pydentic(библиотека для валидации данных через аннотации типов). Основным языком является python.


**Важно**
- ✅ Правильное понимание что FastAPI - это фреймворк для API
- ✅ Упоминание Starlette и Pydantic
- ✅ Понимание назначения (создание API)

**Точно НЕ**
- ❌ "Библиотека" - FastAPI это **фреймворк**, а не библиотека

**Подтермины**
- "Фреймворк" - готовый каркас для разработки, вместо 100 строк, у него уже есть готовое решение
- "Вебсервис" - программа, которая обрабатывает запросы от конечного пользователю и передает их на срвисы бэкэнда
- "Аннотации типов" - подсказка на вхождение и выход типов переменных
- "Генерации документации" - в фастапи она нужна для описания работы апи
- "валидации данных" - проверка на вхождение и выход типов переменных, с помощью аннотации типов
- "сериализации" - это преобразование объектов Python в объект для передачи (JSON, XML) и обратно
- "Starlett" - низкоуровневый ASGI фреймворк (веб-сервер)
- "Pydentic" - библиотека для валидации данных через аннотации типов
- "ASGI" - стандарт для асинхронных веб-приложений Python (наследник WSGI(def)) - async / await
- "Сервис" - программа, которая обрабатывает запросы
- "API" - правила общения между программами, это когда ты можешь делать то, что позволено и не можешь, то что не позволено.



#flashcards/FastAPI
На каких технологиях основан FastAPI  :: На двух основных: **Starlette** (асинхронный веб-фреймворк) и **Pydantic** (валидация данных). Starlette дает саму начинку веб-фреймворка(производительность, асинхронность), Pydantic — валидацию, сериализацию, документацию. Дополнительно: использует **OpenAPI** для автодокументации
<!--SR:!2026-05-12,57,230-->

-----------------------------------------------
#flashcards/FastAPI
Что такое "ручка" (endpoint)?  :: Endpoint (ручка) — это URL-адрес, который принимает HTTP-запросы определенного типа и возвращает ответ. В FastAPI endpoint определяется декоратором @app.get(), @app.post() и т.д. с указанием пути. <br>GET — получение данных (идемпотентный)<br>POST — создание (неидемпотентный)<br>PUT — полное обновление (идемпотентный)<br>PATCH — частичное обновление<br>DELETE — удаление (идемпотентный)<br>Уровень знания данной темы: ознакомлен<br>
<!--SR:!2026-05-16,61,210-->
**Важно**
- ✅ Это НЕ рекомендация FastAPI, а стандарт HTTP/REST
- ✅ Упоминание Starlette и Pydantic
- ✅ Понимание назначения (создание API)

```python
@app.get("/users/{user_id}")  # Это endpoint
def get_user(user_id: int):
    return {"user_id": user_id}
```

-------------------------------
## Вопрос 1: FastAPI — преимущества, производительность

FastAPI — современный высокопроизводительный веб-фреймворк для построения API на Python с использованием подсказок типов.

Ключевые преимущества:
1. Асинхронность — поддержка `async/await` (в отличие от синхронного Flask)
2. Автоматическая документация — Swagger UI, ReDoc (OpenAPI)
3. Валидация через Pydantic — декларативная, быстрая, с автодополнением
4. Dependency Injection — чистая архитектура, тестируемость
5. Производительность — на уровне NodeJS/Go (благодаря Starlette и Pydantic v2 на Rust)
6. Современный Python — полностью использует type hints

За счёт чего производительность:
- Starlette — лёгкий ASGI-фреймворк
- Pydantic — валидация на Rust (`pydantic-core`)
- Асинхронность — эффективная работа с I/O
- Автоматическая оптимизация — сериализация/десериализация

---

## Вопрос 2: ASGI vs WSGI

| | WSGI | ASGI |

|---|----------|----------|

| Тип | Синхронный | Асинхронный |

| Примеры | Flask, Django <3.0 | FastAPI, Django 3.0+ |

| Модель | 1 запрос → 1 поток/процесс | 1 запрос → 1 задача в event loop |

| Протоколы | Только HTTP | HTTP, HTTP/2, WebSockets, long-poll |

| I/O | Блокирующий | Неблокирующий |

| Python | Обычные функции | `async/await` |

FastAPI использует ASGI, потому что:
- Поддержка современных протоколов (WebSockets, HTTP/2)
- Высокая производительность при I/O-bound задачах
- Возможность обрабатывать тысячи соединений одновременно
- Совместимость с асинхронными библиотеками (DB, HTTP clients)

---

## Вопрос 3: Роутинг (Path Operations)

Механизм работы роутинга в FastAPI:

1. Регистрация маршрутов через декораторы:

   ```python

   @app.get("/users/{user_id}")

   def get_user(user_id: int, q: str = Query(None)):

       return {"user_id": user_id, "q": q}

   ```

2. При входящем запросе:
   - FastAPI анализирует HTTP-метод и путь
   - Извлекает path-параметры (`user_id`)
   - Парсит query-параметры (`q`)
   - Валидирует и преобразует типы через Pydantic
   - Проверяет зависимости (Depends)
   - Вызывает функцию с подготовленными аргументами

3. Автоматически:
   - Генерирует OpenAPI схему
   - Создаёт интерактивную документацию
   - Сериализует ответ в JSON (или другой формат)

4. Ключевые компоненты:
   - Path — параметры в URL (`/users/42`)
   - Query — параметры после `?` (`?q=test`)
   - Body — тело запроса (для POST/PUT)
   - Pydantic — валидация и документация

-------------------------------------------------------------
## Вопрос 4: Path, Query, Body, Form

| Параметр | Место | Формат | Назначение | Пример |

|----------|-------|--------|------------|--------|

| Path | URL (`/users/{id}`) | Часть пути | Идентификация ресурса | `/users/42` |

| Query | URL после `?` | `key=value` | Фильтрация, пагинация | `?page=2&sort=asc` |

| Body | Тело запроса | JSON/XML | Сложные данные (POST/PUT) | `{"name": "John"}` |

| Form | Тело запроса | `application/x-www-form-urlencoded` | HTML-формы, OAuth2 | `username=john&password=123` |

Пример:

```python

from fastapi import FastAPI, Path, Query, Body, Form

app = FastAPI()

@app.post("/users/{user_id}")

def create_user(

    user_id: int = Path(..., description="ID пользователя"),

    page: int = Query(1, ge=1),

    user_data: dict = Body(...),

    token: str = Form(...)  # из формы

):

    return {"user_id": user_id, "page": page, "data": user_data, "token": token}

```

---

## Вопрос 5: Pydantic модели и response_model

Pydantic модели — классы на базе `BaseModel` для валидации, сериализации и документирования.

```python

from pydantic import BaseModel, Field

from typing import Optional

class UserIn(BaseModel):          # Входная модель

    name: str = Field(..., max_length=50)

    age: int = Field(gt=0, lt=150)

class UserOut(BaseModel):         # Выходная модель

    id: int

    name: str

    is_adult: bool

@app.post("/users", response_model=UserOut)  # Авто-сериализация

def create_user(user: UserIn):               # Авто-валидация

    # user уже валидирован

    db_user = save_to_db(user)

    return db_user  # автоматически преобразуется в UserOut

```

Роль `response_model`:

- Фильтрация полей (не возвращаем пароли)

- Преобразование типов

- Документация в OpenAPI

---

## Вопрос 6: Вложенные модели и @validator

Вложенные модели (Nested Models):

```python

from pydantic import BaseModel

from typing import List, Optional

class Address(BaseModel):
    city: str
    street: str
    house: int

class User(BaseModel):
    name: str
    age: int
    address: Address  # ✅ Вложенная модель
    tags: List[str] = []

```

Валидация через `@validator`:

```python

from pydantic import BaseModel, validator

class Order(BaseModel):
    items: List[str]
    discount: float
    total: float
    
    @validator('discount')

    def discount_not_too_high(cls, v):
        if v > 0.5:
            raise ValueError('Скидка не может быть > 50%')
        return v

    @validator('total')
    def total_matches_items(cls, v, values):
        if 'items' in values and v < len(values['items'])  10:
            raise ValueError('total слишком мал для количества товаров')
        return v

```

В Pydantic v2 используется `@field_validator` и `@model_validator`

---

## **Вопрос 7: Dependency Injection (Depends)**

**Dependency Injection** — механизм, позволяющий объявлять зависимости в одном месте и переиспользовать их в эндпоинтах.

**Пример с сессией БД:**

```python

from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

# Зависимость
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  # Автоматическое закрытие

# Использование
@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == user_id).first()

```

**Особенности:**
- ✅ **Переиспользование** — одна зависимость во многих эндпоинтах
- ✅ **Вложенность** — `Depends(other_dependency)`
- ✅ **Параметризация** — зависимости с аргументами
- ✅ **Тестируемость** — легко подменить реализацию

---

## **Вопрос 8: Middleware**

**Middleware** — прослойка, обрабатывающая **все** запросы и ответы.

**Порядок выполнения:**
1. Запрос → **Middleware 1 (вход)** → Middleware 2 → ... → Эндпоинт
2. Ответ ← **Middleware 1 (выход)** ← Middleware 2 ← ...

**Пример логирования:**

```python

import time
from fastapi import FastAPI

app = FastAPI()

@app.middleware("http")
async def log_requests(request, call_next):
    start = time.time()
    response = await call_next(request)  # Вызов следующего слоя
    duration = time.time() - start
    print(f"{request.method} {request.url.path} - {duration:.3f}s")
    return response

```

**CORS:**

```python

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешённые домены
    allow_methods=["*"],  # GET, POST, ...
    allow_headers=["*"],  # Заголовки
)

```

**Обработка заголовков:**

```python

@app.middleware("http")
async def add_header(request, call_next):
    response = await call_next(request)
    response.headers["X-App-Version"] = "1.0"
    return response

```

---

## **Вопрос 9: Жизненный цикл (startup/shutdown)**

**События при запуске и остановке приложения:**

```python

from fastapi import FastAPI

app = FastAPI()

@app.on_event("startup")
async def startup():
    # Подключение к БД
    # Инициализация кэша
    # Загрузка ML-моделей
    print("App started")

@app.on_event("shutdown")
async def shutdown():
    # Закрытие соединений
    # Сохранение состояния
    # Очистка ресурсов
    print("App stopped")

```

**Альтернатива (lifespan context manager):**

```python

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Startup")
    yield
    print("Shutdown")

app = FastAPI(lifespan=lifespan)

```

**Использование:**
- ✅ **startup** — подготовка ресурсов перед приёмом запросов
- ✅ **shutdown** — гарантированная очистка при остановке

------------------------------------------------------------------
## Вопрос 10: async def vs def в FastAPI

Как FastAPI обрабатывает:
- `async def` — запускается в event loop (один поток, много задач)
- `def` — запускается в ThreadPoolExecutor (отдельный поток)

Под капотом:

```python

@app.get("/async")
async def read_async():
    await asyncio.sleep(1)  # Не блокирует event loop
    # FastAPI НЕ создаёт новый поток

@app.get("/sync")
def read_sync():
    time.sleep(1)  # Блокирующая операция
    # FastAPI автоматически запускает в thread pool
    # Чтобы не блокировать event loop

```

Когда что использовать:
- ✅ `async def` — I/O-bound (запросы к API, БД с async драйверами)
- ✅ `def` — CPU-bound (вычисления) или синхронные I/O библиотеки

Важно: ❌ FastAPI НЕ использует multiprocessing для синхронных функций — только потоки.

---

## Вопрос 11: BackgroundTasks

BackgroundTasks — механизм для выполнения операций после отправки HTTP-ответа.

Пример:

```python

from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def write_log(message: str):
    with open("analytics.log", "a") as f:
        f.write(f"{message}\n")

@app.post("/user-action")
async def track_action(action: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_log, f"User did: {action}")
    return {"status": "accepted"}  # Ответ сразу, лог пишется после

```

Когда использовать ✅:
- Логирование, аналитика
- Отправка email-уведомлений
- Обновление кэша
- Тяжёлые, но не критичные операции

Когда НЕ использовать ❌:
- Платежи, транзакции (клиент должен знать результат)
- Задачи > 30 секунд (таймаут) → используй Celery, RabbitMQ, Redis Queue
- Задачи, от которых зависит ответ клиенту

---

## Вопрос 12: WebSockets в FastAPI

Процесс работы:
1. Клиент инициирует handshake с HTTP-заголовком `Upgrade: websocket`
2. Сервер принимает через `await websocket.accept()`
3. Двустороннее соединение — оба могут отправлять сообщения
4. При отключении — `WebSocketDisconnect` исключение

Пример:

```python

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Получаем сообщение от клиента
            data = await websocket.receive_text()
            # Отправляем ответ
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        print("Клиент отключился")

```

Для управления несколькими клиентами — ConnectionManager:

```python

class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active.remove(websocket)
    async def broadcast(self, message: str):
        for conn in self.active:
            await conn.send_text(message)

```

Применение: чаты, уведомления, онлайн-игры, биржевые котировки.

-------------------------------------------------------------
## Вопрос 13: Аутентификация и авторизация

Встроенная поддержка в FastAPI:

1. HTTP Basic Auth (устаревший, но есть):

```python

from fastapi.security import HTTPBasic

security = HTTPBasic()

```

2. OAuth2 с JWT (современный стандарт):

```python

from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Ищет токен в заголовке Authorization: Bearer <token>
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # 1. Получаем логин/пароль из формы
    # 2. Проверяем в БД
    # 3. Создаём JWT токен
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me")
def get_user(token: str = Depends(oauth2_scheme)):
    # 1. Декодируем и проверяем JWT
    # 2. Если невалидный → 401
    # 3. Если валидный → возвращаем данные
```

3. Авторизация (проверка ролей):

```python

def require_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403)  # 403 Forbidden
    return user
```

Коды ошибок:
- 401 Unauthorized — ошибка аутентификации (не тот пользователь)
- 403 Forbidden — ошибка авторизации (нет прав)

---

## Вопрос 14: Тестирование FastAPI

Основные библиотеки:
- pytest — запуск тестов, фикстуры, параметризация
- TestClient (из `fastapi.testclient`) — имитация HTTP-запросов
- pytest-asyncio — для тестирования асинхронного кода

Пример теста:

```python

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
    
def test_create_item():
    response = client.post("/items/", json={"name": "Foo"})
    assert response.status_code == 201
    assert response.json()["name"] == "Foo"

```

Тестирование зависимостей (моки):

```python

def test_get_user_with_mock(monkeypatch):
    def mock_get_user():
        return {"id": 1, "name": "Test"}
    monkeypatch.setattr("app.get_current_user", mock_get_user)
    response = client.get("/users/me")
    assert response.json()["name"] == "Test"

```

---

## Вопрос 15: Деплой FastAPI

Подготовка приложения:
- ✅ Тесты пройдены
- ✅ Переменные окружения (`.env`) для секретов
- ✅ CORS настроен
- ✅ Логирование (структурированные логи)
- ✅ Health check эндпоинт (`/health`)
- ✅ Миграции БД (Alembic)
- ✅ Оптимизация (gzip, статика)

ASGI-серверы:

| Конфигурация | Команда | Когда использовать |

|--------------|---------|-------------------|

| Uvicorn | `uvicorn main:app --host 0.0.0.0 --port 8000` | Разработка, простые сервисы |

| Uvicorn с workers | `uvicorn main:app --workers 4` | Несколько процессов (CPU ядра) |

| Gunicorn + Uvicorn | `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker` | ПРОДАКШН — управление процессами, перезапуск при падении |

| Hypercorn | `hypercorn main:app --bind 0.0.0.0:8000` | Если нужен HTTP/2 |

Почему Gunicorn + Uvicorn:
- Gunicorn — менеджер процессов (следит за воркерами, перезапускает при ошибках)
- UvicornWorker — асинхронный воркер (обрабатывает запросы)
- Масштабирование по CPU: `-w $(nproc)` — количество ядер

Docker пример:

```dockerfile

FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]

```
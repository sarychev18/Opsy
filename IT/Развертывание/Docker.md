## К тебе пришли с задачей

> "Упакуй приложение в Docker-контейнер. В проекте SFMShop нужно создать Dockerfile для FastAPI приложения и настроить локальное окружение через Docker Compose с приложением, PostgreSQL и Redis. Это обеспечит одинаковое окружение для всех разработчиков и упростит развертывание."

_**Тимлид**_ показывает тебе ситуацию:

CODE

Копировать

```plaintext
В проекте SFMShop нужно:
- Упаковать приложение в Docker-контейнер
- Настроить локальное окружение через Docker Compose
- Обеспечить взаимодействие между сервисами (приложение, БД, Redis)

Проблема: нет контейнеризации
Нужно настроить Docker и Docker Compose
```

**Проблема:**

- Нет контейнеризации приложения
- Сложно обеспечить одинаковое окружение для всех
- Сложно развертывать приложение

Нужно изучить _**Docker и Docker Compose**_ - как упаковать приложение в контейнер и настроить оркестрацию сервисов.

В прошлом уроке мы изучили логирование и мониторинг. Теперь мы узнаем про _**Docker и Docker Compose**_ - как контейнеризировать приложение и настраивать оркестрацию сервисов.

---

## Что такое Docker

_**Docker**_ - это платформа для контейнеризации приложений, которая позволяет упаковать приложение и все его зависимости в контейнер.

### Зачем нужен Docker

**Проблемы без Docker:**

- Разные окружения на разных машинах
- Сложность развертывания
- Проблемы с зависимостями
- Сложность масштабирования

Одинаковое окружение везде. Легкое развертывание. Изоляция приложений. Масштабируемость.

Используется для контейнеризации приложений, обеспечение одинакового окружения, упрощение развертывания.

---

## Dockerfile

_**Dockerfile**_ - это файл с инструкциями для создания Docker-образа.

### Базовый Dockerfile

dockerfile

Копировать

```plaintext
# Использовать официальный образ Python
FROM python:3.11-slim

# Установить рабочую директорию
WORKDIR /app

# Копировать requirements.txt
COPY requirements.txt .

# Установить зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копировать код приложения
COPY . .

# Открыть порт
EXPOSE 8000

# Запустить приложение
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

`FROM` - базовый образ Python. `WORKDIR` - рабочая директория. `COPY` - копирование файлов. `RUN` - выполнение команд. `EXPOSE` - открытие порта. `CMD` - команда запуска.

Используется для создания docker-образа для приложения.

---

## Сборка и запуск контейнера

### Сборка образа

BASH

Копировать

```bash
# Сборка образа из Dockerfile
docker build -t sfmshop:latest .

# Проверка созданных образов
docker images
```

`docker build` собирает образ из Dockerfile. `-t sfmshop:latest` задает имя и тег образа. `.` указывает на текущую директорию с Dockerfile.

Используется для сборки docker-образа приложения.

---

### Запуск контейнера

BASH

Копировать

```bash
# Запуск контейнера из образа
docker run -p 8000:8000 sfmshop:latest

# Запуск в фоновом режиме
docker run -d -p 8000:8000 sfmshop:latest
```

`docker run` запускает контейнер из образа. `-p 8000:8000` пробрасывает порт (хост:контейнер). `-d` запускает в фоновом режиме.

Используется для запуска приложения в docker-контейнере.

---

## Docker Compose

_**Docker Compose**_ - это инструмент для оркестрации нескольких контейнеров.

### docker-compose.yml

yaml

Копировать

```plaintext
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/sfmshop
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=sfmshop
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

`services` - определение сервисов. `app` - приложение FastAPI. `db` - база данных PostgreSQL. `redis` - Redis для кэша. `volumes` - постоянное хранилище данных. `depends_on` - зависимости между сервисами.

Используется для оркестрации нескольких сервисов через docker compose.

-------------
**Некоторые основные команды Docker Compose**:

- **docker-compose up** — запускает все службы, описанные в файле docker-compose.yml, при необходимости создаёт соответствующие контейнеры, сети и тома.
- **docker-compose down** — останавливает и удаляет контейнеры, сети и тома, созданные с помощью команды up.
- **docker-compose ps** — показывает текущий статус запущенных контейнеров, их имена, идентификаторы и порты.
- **docker-compose exec <имя_сервиса> <команда>** — выполняет команду в работающем контейнере указанного сервиса. Например, 
    
    docker-compose exec db psql -U user -d mydatabase
    
    .
- **docker-compose logs [имя_сервиса]** — отображает логи для указанного сервиса или для всех сервисов, если имя не указано. Можно использовать флаг 
    
    -f или --follow
    
    , чтобы следить за логами в реальном времени.

---

### Запуск через Docker Compose

BASH

Копировать

```bash
# Запуск всех сервисов
docker-compose up

# Запуск в фоновом режиме
docker-compose up -d

# Остановка сервисов
docker-compose down

# Просмотр логов
docker-compose logs -f
```

`docker-compose up` запускает все сервисы. `-d` запускает в фоновом режиме. `down` останавливает и удаляет контейнеры. `logs` показывает логи сервисов.

Используется для управления несколькими сервисами через docker compose.

---

## Volumes

_**Volumes**_ - это постоянное хранилище данных для контейнеров.

### Использование volumes

yaml

Копировать

```plaintext
services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

`volumes` создает постоянное хранилище. Данные сохраняются после остановки контейнера. Можно использовать для БД, логов и т.д.

Используется для сохранения данных бд между перезапусками контейнеров.

---

## Networks

_**Networks**_ - это виртуальные сети для связи между контейнерами.

### Использование networks

yaml

Копировать

```plaintext
services:
  app:
    networks:
      - app_network

  db:
    networks:
      - app_network

networks:
  app_network:
    driver: bridge
```

`networks` создает виртуальную сеть. Контейнеры могут общаться друг с другом. Изоляция от других сетей.

Используется для связь между контейнерами в docker compose.

---

## Multi-stage build (базово, упоминание)

_**Multi-stage build**_ - это оптимизация образа через несколько этапов сборки.

### Пример multi-stage build

dockerfile

Копировать

```plaintext
# Этап 1: Сборка
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Этап 2: Финальный образ
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Первый этап устанавливает зависимости. Второй этап копирует только нужные файлы. Итоговый образ меньше по размеру.

Используется для оптимизация размера docker-образа.

---

## Решение задачи

Теперь мы можем решить задачу! Давай создадим Dockerfile и docker-compose.yml для проекта SFMShop.

**Создание Dockerfile:**

dockerfile

Копировать

```plaintext
# docker/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Копировать requirements.txt
COPY requirements.txt .

# Установить зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копировать код приложения
COPY . .

# Открыть порт
EXPOSE 8000

# Запустить приложение
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Создание docker-compose.yml:**

yaml

Копировать

```plaintext
# docker/docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/sfmshop
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ../src:/app/src

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=sfmshop
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Dockerfile упаковывает приложение в контейнер. docker-compose.yml оркестрирует все сервисы. Приложение, БД и Redis работают вместе. Данные сохраняются в volumes.

Одинаковое окружение для всех. Легкое развертывание. Изоляция сервисов. Упрощение разработки.
## К тебе пришли с задачей

> "Настроить CI/CD для проекта. В проекте SFMShop нужно автоматизировать тестирование и развертывание. При каждом push в репозиторий нужно автоматически запускать тесты, а при merge в main - автоматически развертывать приложение в продакшене."

_**Тимлид**_ показывает тебе ситуацию:

CODE

Копировать

```plaintext
В проекте SFMShop нужно:
- Автоматически запускать тесты при каждом push
- Автоматически развертывать приложение при merge в main
- Обеспечить качество кода перед развертыванием

Проблема: нет автоматизации
Нужно настроить CI/CD
```

**Проблема:**

- Нет автоматизации тестирования
- Ручное развертывание - медленно и ошибкоопасно
- Нет проверки качества кода перед развертыванием

Нужно изучить _**CI/CD**_ - непрерывную интеграцию и непрерывное развертывание, автоматизацию тестирования и развертывания.

В прошлом уроке мы изучили переменные окружения. Теперь мы узнаем про _**CI/CD**_ - автоматизацию тестирования и развертывания.

---

## Что такое CI/CD

_**CI (Continuous Integration)**_ — это практика автоматического тестирования кода при каждом изменении.

_**CD**_ — аббревиатура может означать два разных понятия:

- **Continuous Delivery (непрерывная поставка)** — код всегда в состоянии, готовом к развертыванию. Pipeline собирает артефакты, прогоняет тесты, подготавливает релиз, но **развертывание в прод выполняется вручную** (по кнопке, по одобрению, по решению команды). То есть доставка до «ворот» продакшена автоматическая, а момент релиза контролирует человек.
- **Continuous Deployment (непрерывное развертывание)** — **полностью автоматическое** развертывание в прод после успешного прохождения всех проверок. Как только тесты и другие шаги прошли — деплой в прод происходит без ручного шага.

**Когда что используют:**

|Подход|Когда уместен|
|---|---|
|**Continuous Delivery**|Нужен контроль над моментом релиза (релизы по расписанию, согласования, регуляторика). Команда хочет быть готовой деплоить в любой момент, но сама выбирает когда.|
|**Continuous Deployment**|Максимально быстрая доставка в прод, полное доверие автоматизации. Часто в стартапах, продуктах с сильной автоматизацией и быстрым циклом обратной связи.|

В обоих случаях CI один и тот же; разница только в том, есть ли ручной шаг перед деплоем в прод. В контексте урока дальше под «CD» подразумевается настройка pipeline до стадии деплоя; решать, будет ли деплой автоматическим (Deployment) или по кнопке (Delivery), можно в настройках workflow (например, убрав или добавив ручное одобрение).

### Зачем нужен CI/CD

**Проблемы без CI/CD:**

- Ручное тестирование - медленно
- Ручное развертывание - ошибкоопасно
- Нет автоматической проверки качества
- Сложность отслеживания изменений

Автоматическое тестирование. Автоматическое развертывание. Быстрое обнаружение ошибок. Упрощение процесса разработки.

Используется для автоматизация тестирования и развертывания в проектах.

---

## GitHub Actions

_**GitHub Actions**_ - это встроенная система CI/CD в GitHub.

### Создание workflow

yaml

Копировать

```plaintext
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        pytest --cov=src --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
```

`on` - триггеры для запуска workflow. `jobs` - задачи для выполнения. `steps` - шаги выполнения задачи. Автоматический запуск тестов при push.

Используется для настройка ci для автоматического тестирования.

---

## GitLab CI

_**GitLab CI**_ - это система CI/CD в GitLab.

### Создание .gitlab-ci.yml

yaml

Копировать

```plaintext
# .gitlab-ci.yml
stages:
  - test
  - deploy

test:
  stage: test
  image: python:3.11
  script:
    - pip install -r requirements.txt
    - pytest --cov=src
  only:
    - main
    - develop

deploy:
  stage: deploy
  script:
    - echo "Deploying to production..."
  only:
    - main
```

`stages` - этапы выполнения. `test` - этап тестирования. `deploy` - этап развертывания. Автоматический запуск при push.

Используется для настройка ci/cd в gitlab.

---

## Автоматическое тестирование

### Запуск тестов в CI

yaml

Копировать

```plaintext
- name: Run tests
  run: |
    pytest --cov=src --cov-report=xml
```

Тесты запускаются автоматически. Покрытие кода проверяется. Результаты сохраняются.

Используется для автоматическая проверка качества кода.

---

## Автоматическое развертывание

### Развертывание после успешного тестирования

yaml

Копировать

```plaintext
deploy:
  needs: test
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
  - uses: actions/checkout@v3
  
  - name: Deploy to production
    run: |
      echo "Deploying to production..."
      # Команды развертывания
```

Развертывание запускается только после успешного тестирования. Развертывание только для main ветки. Автоматическое развертывание в продакшен.

Используется для автоматическое развертывание после тестирования.

---

## Решение задачи

Теперь мы можем решить задачу! Давай создадим CI/CD pipeline для проекта SFMShop.

**Создание GitHub Actions workflow:**

yaml

Копировать

```plaintext
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: sfmshop_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run tests
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/sfmshop_test
      run: |
        pytest --cov=src --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Команды развертывания (например, kubectl apply)
```

Автоматический запуск тестов при push. Тесты запускаются с PostgreSQL в CI. Развертывание только после успешного тестирования. Развертывание только для main ветки.

Автоматическое тестирование. Автоматическое развертывание. Быстрое обнаружение ошибок. Упрощение процесса разработки.
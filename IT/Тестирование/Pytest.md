**КРАТКИЙ ОТВЕТ (для интервьюера):**
   - «Установка: `pip install pytest` (лучше в venv).
   - Запуск: команда `pytest` (флаги `-v` подробно, `-s` вывод print, `-m` маркеры).
   - Структура: папка `tests/`, файлы `test_*.py`, функции `test_*`, фикстуры в `conftest.py`.
   - Конфигурация: `pytest.ini` или `pyproject.toml` для настроек по умолчанию 🚀».

  Для Middle разработчика важно не просто запустить тест, а настроить окружение для CI и команды.

   **1. Установка (Installation):**
   - **Виртуальное окружение:** Всегда устанавливай в `venv` или `poetry`, не в системный Python.
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   pip install pytest pytest-asyncio pytest-cov
   ```
   - **Плагины:** `pytest-asyncio` (для FastAPI), `pytest-cov` (покрытие кода), `pytest-mock` (моки).

   **2. Запуск тестов (Running Commands):**
   | Команда | Описание |
   |---------|----------|
   | `pytest` | Запуск всех тестов |
   | `pytest -v` | Подробный вывод (verbose) |
   | `pytest -s` | Показать `print()` в тестах |
   | `pytest -k name` | Запустить тесты по имени (substring) |
   | `pytest -m unit` | Запустить только тесты с маркером `@pytest.mark.unit` |
   | `pytest --cov=app` | Показать покрытие кода тестами |
   | `pytest -x` | Остановиться после первой ошибки |

   **3. Структура проекта (Project Structure):**
   Лучшая практика для масштабируемого проекта:
   ```text
   project/
   ├── app/                 # Исходный код
   │   ├── main.py
   │   └── models.py
   ├── tests/               # Тесты
   │   ├── unit/            # Юнит-тесты (быстрые)
   │   ├── integration/     # Интеграционные (с БД)
   │   ├── conftest.py      # Общие фикстуры
   │   └── pytest.ini       # Локальный конфиг
   ├── pyproject.toml       # Зависимости
   └── .gitignore
   ```
   - **Правила именования:**
     - Файлы: `test_*.py` или `*_test.py`.
     - Функции: `test_*`.
     - Классы: `Test*`.

   **4. Конфигурация (pytest.ini):**
   Чтобы не писать флаги каждый раз:
   ```ini
   # pytest.ini
   [pytest]
   testpaths = tests
   python_files = test_*.py
   python_functions = test_*
   addopts = -v --strict-markers
   markers =
       unit: Unit tests
       integration: Integration tests
   ```

   **🎯 Совет для Middle:**
   На собеседовании скажи: «Я использую `conftest.py` для общих фикстур, разделяю тесты по папкам (unit/integration) и настраиваю `pytest.ini` для единого стиля запуска в команде».

4. **3 ВОПРОСА ДЛЯ ПРОВЕРКИ (Тема: Pytest Basics):**
   5. **Conftest:** Видны ли фикстуры из `tests/conftest.py` в тестах внутри `tests/unit/test_api.py`?
   6. **Markers:** Что будет, если запустить `pytest -m unit`, а маркер `unit` не зарегистрирован в конфиге? (Подсказка: `--strict-markers`).
   7. **Exit Codes:** Какой код возврата (exit code) вернет pytest, если все тесты прошли успешно? (0 или 1?)

-----------
## Pytest Advanced: фикстуры (scope, conftest)

1. **КРАТКИЙ ОТВЕТ (для интервьюера):**
   - «**Scope** определяет время жизни фикстуры: `function` (каждый тест), `session` (все тесты). Это влияет на производительность и изоляцию.
   - **Conftest.py** — это файл автоматического обнаружения фикстур. Pytest ищет их от корня тестов до папки теста, позволяя переопределять фикстуры локально.
   - **Yield** разделяет setup (до) и teardown (после). Порядок teardown обратный порядку setup 🚀».

   Для Middle разработчика важно понимать порядок выполнения, чтобы избегать утечек памяти и «грязных» тестов.

   **1. Scope и Жизненный цикл (Execution Order):**
   - Fixtures с большим scope создаются **первыми**, уничтожаются **последними**.
   - Если тест использует `session` и `function` фикстуры:
     1. Setup `session`
     2. Setup `function`
     3. **Тест**
     4. Teardown `function`
     5. (После всех тестов) Teardown `session`
   ```python
   @pytest.fixture(scope="session")
   def db():
       print("DB Connect")
       yield
       print("DB Close")
   
   @pytest.fixture(scope="function")
   def data(db):
       print("Data Prep")
       yield
       print("Data Clean")
   ```
   
## Scope

**По умолчанию** фикстура выполняется для каждой тестовой функции, которая её запрашивает. Это поведение можно изменить с помощью параметра 

scope

 в декораторе 

@pytest.fixture

. [python-academy.org](https://python-academy.org/ru/guide/pytest-fixtures-parametrization)

**Доступные области действия**: [python-academy.org](https://python-academy.org/ru/guide/pytest-fixtures-parametrization)

- function
     (по умолчанию) — фикстура выполняется один раз для каждой тестовой функции;
- class
     — фикстура выполняется один раз для каждого тестового класса;
- module
     — фикстура выполняется один раз для каждого модуля;
- package
     — фикстура выполняется один раз для каждого пакета (Python 3);
- session
     — фикстура выполняется один раз за всю тестовую сессию.

   **2. Conftest и Иерархия (Discovery Mechanism):**
   - Pytest ищет `conftest.py` начиная от корня запуска вверх до папки теста.
   - **Переопределение:** Фикстура в `tests/unit/conftest.py` переопределит фикстуру из `tests/conftest.py` для тестов внутри `unit`.
   ```text
   tests/
   ├── conftest.py       # Фикстура "app" (базовая)
   ├── unit/
   │   ├── conftest.py   # Фикстура "app" (переопределенная для unit)
   │   └── test_api.py   # Использует локальную "app"
   ```
   - **Важно:** Импортировать фикстуры из `conftest` не нужно! Pytest injects их по имени аргумента.

   **3. Yield и Teardown (Garbage Collection):**
   - Код до `yield` — это setup.
   - Код после `yield` — это teardown.
   - **Гарантия:** Teardown выполнится даже если тест упал (AssertionError).
   ```python
   @pytest.fixture
   def temp_file():
       f = open("test.txt", "w")
       yield f
       f.close()  # Выполнится всегда!
       os.remove("test.txt")
   ```

   **4. Опасности (Middle Level Pitfalls):**
   - **Mutable State in Session Scope:** Если сохранить список в `scope="session"` и менять его в тестах, следующий тест увидит изменения.
   - **Circular Dependencies:** Фикстура А зависит от Б, Б от А → ошибка.
   - **Naming Conflicts:** Случайное имя фикстуры может переопределить системную (например, `tmp_path`).

   **🎯 Совет для Middle:**
   На собеседовании скажи: «Я использую `scope="session"` только для тяжелых ресурсов (БД, Docker), но всегда проверяю, чтобы они не сохраняли изменяемое состояние между тестами. Иерархию `conftest` использую для специфичных моков в подпапках».

4. **3 ВОПРОСА ДЛЯ ПРОВЕРКИ (Тема: Fixtures Mechanics):**
   5. **Teardown Order:** Если тест использует фикстуры A (session) и B (function), какая из них уничтожится первой после теста?
   6. **Conftest Hierarchy:** Если фикстура `db` определена в корневом `conftest.py` и в `tests/api/conftest.py`, какую увидит тест в `tests/api/test_users.py`?
   7. **Yield Safety:** Выполнится ли код после `yield`, если в тесте произойдет краш процесса (KeyboardInterrupt), а не просто AssertionError?

-----------
### Параметризация тестов
_**Параметризация**_ - это способ запустить один тест с разными данными.
Параметризация через @pytest.mark.parametrize
```python
@pytest.mark.parametrize("order_total,expected_discount", [
    (500, 0),      # Нет скидки
    (1000, 50),    # 5% скидка
    (5000, 500),   # 10% скидка
    (10000, 1500), # 15% скидка
])
def test_calculate_discount(order_total, expected_discount):
    """Тест: расчет скидки для разных сумм"""
    from src.utils.calculations import calculate_discount
    assert calculate_discount(order_total) == expected_discount
```
------
## **Markers**
2. **КРАТКИЙ ОТВЕТ (для интервьюера):**
   - «**Markers** — это метки для категоризации тестов (`@pytest.mark.smoke`, `@pytest.mark.slow`).
   - Позволяют запускать выборочно: `pytest -m smoke` (только критичные), `pytest -m "not slow"` (все кроме медленных).
   - Важно регистрировать кастомные маркеры в `pytest.ini` с флагом `--strict-markers`, чтобы избежать опечаток 🚀».

3. **ПОЛНЫЙ ОТВЕТ (для глубокого понимания):**

   **👵 Как для бабушки:**
   - **Маркеры:** Представь, что ты сортируешь письма на почте.
     - **Красный стикер:** «Срочно!» (Smoke tests) — проверяем в первую очередь.
     - **Желтый стикер:** «Долго читать» (Slow tests) — откладываем на вечер.
     - **Зеленый стикер:** «Архив» (Regression) — проверяем раз в неделю.
   - **Зачем:** Чтобы не перебирать всю кучу писем каждый раз, а брать только те, что нужны сейчас 📬.

  Для Middle разработчика маркеры — это инструмент оптимизации CI/CD пайплайна.

   **1. Встроенные маркеры (Built-in):**
   - `@pytest.mark.skip`: Пропустить тест всегда (или по условию `skipif`).
   - `@pytest.mark.xfail`: Ожидать провал (test expected to fail). Не ломает пайплайн.
   - `@pytest.mark.parametrize`: (Технически тоже маркер) для данных.
   ```python
   @pytest.mark.skip(reason="Не готово")
   def test_future_feature():
       pass
   
   @pytest.mark.xfail
   def test_known_bug():
       assert False  # Не ломает сборку
   ```

   **2. Кастомные маркеры (Custom):**
   - Разметка в коде:
   ```python
   @pytest.mark.smoke
   def test_login(): ...  # Критичный путь
   
   @pytest.mark.slow
   def test_heavy_calculation(): ...  # Долгий тест
   ```
   - **Регистрация (Обязательно!):** В `pytest.ini`, чтобы видеть предупреждения.
   ```ini
   # pytest.ini
   [pytest]
   markers =
       smoke: Critical tests for deployment
       slow: Tests taking more than 1 sec
       integration: Tests requiring DB
   ```

   **3. Запуск в CLI (Command Line):**
   - **Логика И (AND):** `pytest -m "slow and integration"`
   - **Логика ИЛИ (OR):** `pytest -m "slow or smoke"`
   - **Отрицание (NOT):** `pytest -m "not slow"` (Быстрые тесты для PR).
   - **Строгий режим:** `pytest --strict-markers` (Ошибка, если маркер не зарегистрирован).

   **4. Использование в CI/CD:**
   - **Pre-commit:** Запуск только `unit` и `smoke`.
   - **Nightly Build:** Запуск всех тестов, включая `slow` и `integration`.
   - **Deploy:** Блокировка, если `smoke` упали.

   **🎯 Совет для Middle:**
   На собеседовании скажи: «Я использую маркеры для разделения пайплайна на стадии. Smoke-тесты запускаются на каждый коммит, а тяжелые интеграционные — только ночью. Обязательно включаю `--strict-markers`, чтобы команда не придумывала свои метки».

4. **3 ВОПРОСА ДЛЯ ПРОВЕРКИ (Тема: Pytest Markers):**
   5. **Strict Mode:** Что произойдет, если запустить тест с незарегистрированным маркером в режиме `--strict-markers`?
   6. **Логика:** Как запустить тесты, которые помечены И как `slow`, И как `integration` одновременно?
   7. **Skip vs Xfail:** В чем разница между пропущенным тестом (`skip`) и ожидаемо проваленным (`xfail`)?
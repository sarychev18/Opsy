## Что такое моки и стабы

_**Мок (Mock)**_ - это объект, который имитирует поведение реального объекта для тестирования.

_**Стаб (Stub)**_ - это упрощенная версия объекта, которая возвращает предопределенные значения.

### Зачем нужны моки

**Проблемы без моков:**

- Тесты зависят от внешних сервисов (БД, API)
- Тесты медленные
- Невозможно тестировать изолированно
- Сложно тестировать ошибки

Изоляция тестов от внешних зависимостей. Быстрые тесты. Возможность тестировать ошибки. Упрощение тестирования.

Используется для изоляции тестов от бд, внешних api, файловой системы.

#flashcards/Тестирование 
В чем заключается разница между моком (Mock) и стабом (Stub) ?  :: Stub Возвращает фиксированные данные для входа в ветку кода.напиши, **Mock** -  Проверяет, был ли вызван метод с определёнными аргументами.


### Mock vs Stub (Концептуально)

| Тип      | Цель                        | Пример                                                      |
| -------- | --------------------------- | ----------------------------------------------------------- |
| **Stub** | **Состояние (State)**       | Возвращает фиксированные данные для входа в ветку кода.     |
| **Mock** | **Поведение (Interaction)** | Проверяет, был ли вызван метод с определёнными аргументами. |

### 🔹 Пример разницы

```python
# Stub: нам важен результат
stub_db = Mock()
stub_db.get_user.return_value = {"id": 1}  # ✅ Данные
assert service.get_name() == "Alex"

# Mock: нам важен факт вызова
mock_logger = Mock()
service.process()
mock_logger.info.assert_called_once_with("Processed")  # ✅ Взаимодействие
```
### 🔹 Проблема хрупкости (Brittle Tests)

- **Over-mocking:** Если замокать всё вокруг, тест начинает проверять реализацию, а не поведение.
- **Рефакторинг:** Любое изменение внутренней логики ломает тесты, даже если функциональность не изменилась.
- **Совет:** Мокай только внешние границы (БД, API), внутреннюю логику тестируй через результат.

---

## Библиотека unittest.mock

_**unittest.mock**_ - это встроенная библиотека Python для создания моков.

### Импорт unittest.mock

PYTHON

Копировать

```python
from unittest.mock import Mock, MagicMock, patch
```

Используется для импорта библиотеки для работы с моками.

---

## Создание моков

### Mock

_**Mock**_ - это базовый класс для создания моков.

PYTHON

Копировать

```python
from unittest.mock import Mock

# Создание мока
mock_db = Mock()

# Настройка возвращаемого значения
mock_db.execute.return_value = {"id": 1, "status": "created"}

# Использование мока
result = mock_db.execute("SELECT * FROM orders")
print(result)  # {"id": 1, "status": "created"}
```

Создается мок объекта БД. Настраивается возвращаемое значение метода. Мок используется вместо реального объекта.

Используется для создания простых моков для тестирования.

---

### MagicMock

_**MagicMock**_ - это расширенная версия Mock, которая автоматически создает атрибуты.

PYTHON

Копировать

```python
from unittest.mock import Mock, MagicMock

# Создание MagicMock
mock_service = MagicMock()

# Автоматически создаются атрибуты
mock_service.get_user.return_value = {"id": 1, "name": "Test"}
mock_service.send_email.return_value = True

# Использование
user = mock_service.get_user(1)
print(user)  # {"id": 1, "name": "Test"}


# разниа MagicMock vs Mock
m = Mock()
m()  # ✅ Вызов работает
m.__str__()  # ❌ Не работает (нет магических методов)

mm = MagicMock()
mm.__str__()  # ✅ Работает автоматически
mm()  # ✅ Вызов работает
```

MagicMock автоматически создает атрибуты при обращении. Не нужно явно создавать методы. Удобно для сложных объектов.

Используется для создания моков для сложных объектов с множеством методов.

---

## Патчинг (patch)

_**Патчинг**_ - это замена реального объекта моком во время выполнения теста.

### @patch декоратор

PYTHON

Копировать

```python
from unittest.mock import patch

@patch('src.database.connection.execute')
def test_create_order(mock_execute):
    """Тест создания заказа с моком БД"""
    # Настройка мока
    mock_execute.return_value = {"id": 1, "status": "created"}
    
    # Вызов функции, которая использует БД
    result = create_order({"user_id": 1})
    
    # Проверка результата
    assert result["id"] == 1
    # Проверка, что метод был вызван
    mock_execute.assert_called_once()
```

`patch` заменяет объект **по пути импорта**, а не по месту определения.
```python
# my_service.py
from utils import send_email  # Импорт здесь

def process():
    send_email()  # Патчить нужно 'my_service.send_email', а не 'utils.send_email'
```
`@patch` заменяет реальный объект моком. Мок настраивается в тесте. Проверяется, что метод был вызван.

Используется для замены внешних зависимостей моками в тестах.

---

### patch как контекстный менеджер

PYTHON

Копировать

```python
from unittest.mock import patch

def test_create_order():
    """Тест с использованием patch как контекстного менеджера"""
    with patch('src.database.connection.execute') as mock_execute:
        mock_execute.return_value = {"id": 1}
        
        result = create_order({"user_id": 1})
        
        assert result["id"] == 1
        mock_execute.assert_called_once()
```

`patch` используется как контекстный менеджер. Мок активен только внутри блока `with`. После выхода из блока реальный объект восстанавливается.

#flashcards/Тестирование 
Как работает декоратор @patch и в каких случаях его удобнее использовать в качестве контекстного менеджера (через блок with)? :: **@patch** - На всю функцию теста, **with patch** - Точечная замена в блоке

| Подход               | Когда использовать      | Пример                    |
| -------------------- | ----------------------- | ------------------------- |
| **@patch**           | На всю функцию теста    | `@patch('db.connect')`    |
| **with patch**       | Точечная замена в блоке | `with patch('api.call'):` |
| **patch.start/stop** | В setUp/tearDown        | Для классовых тестов      |
```python
# ✅ Декоратор (проще, чище)
@patch('module.requests.get')
def test_api(mock_get):
    mock_get.return_value = {'status': 200}
    assert call_api() == 200

# ✅ Контекстный менеджер (гибче)
def test_mixed():
    result1 = process()  # Без мока
    
    with patch('module.db.query') as mock_db:
        mock_db.return_value = []
        result2 = process()  # С моком БД
    
    result3 = process()  # Снова без мока
```

Используется для временной замены объектов моками в тестах.

---

## Изоляция тестов от БД

### Мокирование БД для тестов классов

PYTHON

Копировать

```python
from unittest.mock import patch
from src.models.order import Order

@patch('src.database.connection.execute')
def test_order_save(mock_execute):
    """Тест сохранения заказа с моком БД"""
    # Настройка мока
    mock_execute.return_value = {"id": 1}
    
    # Создание заказа
    order = Order(user_id=1, total=5000)
    
    # Сохранение (использует мок БД)
    order.save()
    
    # Проверка, что метод БД был вызван
    mock_execute.assert_called_once()
    assert order.id == 1
```

БД замокирована через `@patch`. Тест не использует реальную БД. Тест быстрый и изолированный.

Используется для тестирования классов без реальной бд.

---

## Изоляция тестов от внешних API

### Мокирование HTTP-запросов

PYTHON

Копировать

```python
from unittest.mock import patch
import requests

@patch('requests.get')
def test_fetch_external_data(mock_get):
    """Тест получения данных из внешнего API"""
    # Настройка мока
    mock_get.return_value.json.return_value = {"data": "test"}
    mock_get.return_value.status_code = 200
    
    # Вызов функции, которая использует requests
    result = fetch_external_data("https://api.example.com/data")
    
    # Проверка результата
    assert result == {"data": "test"}
    # Проверка, что запрос был сделан
    mock_get.assert_called_once_with("https://api.example.com/data")
```

HTTP-запросы замокированы через `@patch`. Тест не делает реальные запросы. Тест быстрый и не зависит от внешнего API.

Используется для тестирования функций, которые используют внешние api.

---

## Мокирование зависимостей между классами

### Мокирование зависимостей

PYTHON

Копировать

```python
from unittest.mock import Mock, patch
from src.models.order import Order

@patch('src.services.email_service.send_email')
def test_order_notification(mock_send_email):
    """Тест отправки уведомления при создании заказа"""
    # Настройка мока
    mock_send_email.return_value = True
    
    # Создание заказа
    order = Order(user_id=1, total=5000)
    order.create()
    
    # Проверка, что email был отправлен
    mock_send_email.assert_called_once_with(
        user_id=1,
        message="Заказ создан"
    )
```

Зависимость (email_service) замокирована. Тест проверяет взаимодействие между классами. Тест не отправляет реальные email.

Используется для тестирования взаимодействия между компонентами.

---

## Тестирование ошибок с моками

### Мокирование ошибок

PYTHON

Копировать

```python
from unittest.mock import patch
import pytest

@patch('src.database.connection.execute')
def test_order_creation_error(mock_execute):
    """Тест обработки ошибки при создании заказа"""
    # Настройка мока для выброса ошибки
    mock_execute.side_effect = Exception("Database error")
    
    # Проверка, что ошибка обрабатывается
    with pytest.raises(Exception):
        create_order({"user_id": 1})
```

Мок настроен на выброс ошибки через `side_effect`. Тест проверяет обработку ошибок. Не нужно создавать реальную ошибку в БД.

Используется для тестирования обработки ошибок.

#flashcards/Тестирование 
Как с помощью мока имитировать возникновение ошибки (исключения) в тестируемом методе, например, для проверки обработки сбоя в базе данных? :: Присваиваем исключение — при вызове мока оно выбрасывается. Проверяем через `pytest.raises` или assert на результат обработки<br>
```python
from unittest.mock import patch, Mock
import pytest

# ✅ Способ 1: side_effect с исключением
@patch('module.db.connect')
def test_db_error(mock_connect):
    mock_connect.side_effect = ConnectionError("DB Down")  # ✅
    
    with pytest.raises(ConnectionError):
        process_data()

# ✅ Способ 2: side_effect с функцией
def raise_error():
    raise ValueError("Invalid input")

mock_func = Mock()
mock_func.side_effect = raise_error  # ✅ Вызовет функцию при вызове

# ✅ Способ 3: Последовательные вызовы
mock_func.side_effect = [1, 2, ConnectionError()]  # ✅
# 1-й вызов → 1
# 2-й вызов → 2
# 3-й вызов → ConnectionError()
```

---

## Решение задачи

Теперь мы можем решить задачу! Давай сначала посмотрим, как делать НЕ нужно, а потом покажем правильное решение.

Вот типичная ошибка новичков:

PYTHON

Копировать

```python
# Проблема: тесты используют реальную БД
def test_create_order():
    """Тест создания заказа"""
    # Использует реальную БД - медленно и зависимо
    response = client.post("/orders", json={
        "user_id": 1,
        "items": [{"product_id": 1, "quantity": 2}]
    })
    assert response.status_code == 201
    # Проблема: тест зависит от БД
```

Это будет работать, но есть проблема: Тесты используют реальную БД. Тесты медленные. Тесты зависят от внешних сервисов. Невозможно запустить без БД.

**Правильное решение:**

PYTHON

Копировать

```python
# tests/test_api.py
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

@patch('src.database.connection.execute')
def test_create_order(mock_execute):
    """Тест создания заказа с моком БД"""
    # Настройка мока БД
    mock_execute.return_value = {"id": 1, "status": "created"}
    
    # Вызов API
    response = client.post("/orders", json={
        "user_id": 1,
        "items": [{"product_id": 1, "quantity": 2}]
    })
    
    # Проверка результата
    assert response.status_code == 201
    assert response.json()["id"] == 1
    
    # Проверка, что БД была вызвана
    mock_execute.assert_called_once()

@patch('src.services.cache_service.get')
@patch('src.services.cache_service.set')
def test_get_products(mock_cache_set, mock_cache_get):
    """Тест получения товаров с моком кэша"""
    # Настройка мока кэша
    mock_cache_get.return_value = None  # Кэш пуст
    mock_cache_set.return_value = True
    
    # Вызов API
    response = client.get("/products")
    
    # Проверка результата
    assert response.status_code == 200
    # Проверка, что кэш был использован
    mock_cache_get.assert_called_once()
```

БД замокирована через `@patch`. Кэш замокирован через `@patch`. Тесты быстрые и изолированные. Тесты не зависят от внешних сервисов.

Быстрые тесты. Изоляция от внешних зависимостей. Возможность тестировать ошибки. Упрощение тестирования.
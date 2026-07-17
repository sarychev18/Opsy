#flashcards/FastAPI 

------------------------------------------------
### Тело запроса

#flashcards/FastAPI 
Тело запроса это ?  :: **Тело запроса (request body)** — это данные, которые клиент отправляет API, обычно в формате **JSON**.<br>**Используется с HTTP-методами:**<br>**POST** — для создания ресурсов<br>**PUT** — для полного обновления<br>**PATCH** — для частичного обновления<br>**DELETE** — иногда (например, для сложных условий удаления)<br><br>**Не используется с:**<br>- **GET** — по спецификации HTTP не должен иметь тела (данные передаются через query-параметры)<br>**В FastAPI** тело запроса определяется через **Pydantic модели** (классы, наследующиеся от `BaseModel`), которые обеспечивают автоматическую валидацию, сериализацию и документацию.
<!--SR:!2026-04-14,29,190-->

**Важно**
- ✅ Правильное понимание что FastAPI - это фреймворк для API
- ✅ Упоминание Starlette и Pydantic
- ✅ Понимание назначения (создание API)

**Точно НЕ**
- ❌ не используется с GET

```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item

# Клиент отправляет в JSON
{
    "name": "Ноутбук",
    "price": 999.99
}
```

-----------------------------------------------

#### Query-параметры и валидация строк

#flashcards/FastAPI 
как работает Валидация строк  в FastAPI?  :: валидация строк в FastAPI работает через Pydantic на двух уровнях:<br><br>1. **Pydantic-модели** (для Body) — через `Field()` с параметрами `min_length`, `max_length`, `regex`, `pattern`<br>2. В параметрах эндпоинта – через Query(), Path(), Body() с аргументами min_length, max_length, regex.<br>Ключевая мысль: Вся валидация делегируется Pydantic, что обеспечивает согласованность и богатые возможности проверки. ✅
<!--SR:!2026-04-11,26,170-->

**Важно**
- ✅ можно в Query или Path использовать параметры↓

|Параметр|Назначение|Пример|
|---|---|---|
|`min_length`|Минимальная длина|`min_length=3`|
|`max_length`|Максимальная длина|`max_length=100`|
|`pattern`|Регулярное выражение|`pattern="^[a-z]+$"`|
|`strip_whitespace`|Обрезать пробелы|`strip_whitespace=True` (по умолчанию)|
|`to_lower`|Приводить к нижнему регистру|`to_lower=True`|
|`examples`|Примеры в документации|`examples=["test", "demo"]`|

```python
from typing import Annotated

from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(q: Annotated[str | None, Query(max_length=50)] = None):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```
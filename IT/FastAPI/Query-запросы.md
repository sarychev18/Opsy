#flashcards/FastAPI 
что за такое Query-параметры ?  :: это пары `ключ=значение` в строке запроса URL (после `?`). Используются для **фильтрации, сортировки, пагинации** (например, `/items?category=books&limit=10`). В FastAPI объявляются как параметры функции, не входящие в Path. Это необязательный параметр. также можно импортировать Query для доп. валидации.
<!--SR:!2026-05-06,51,210-->


```python
@app.get("/users/")
def get_user(user_id: int, q: str | None = None):
    return {"id": user_id}
```

```python
URL: /api/v1/users?active=true&role=admin&limit=100&offset=0
       ↑                   ↑         ↑         ↑         ↑
    endpoint        query param1  q_param2    q_param3  q_param4
```

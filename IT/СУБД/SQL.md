![[Pasted image 20260318110337.png]]SQL пишется в одном порядке, выполняется в другом:

1. `FROM` / `JOIN` (Откуда брать данные)
2. `WHERE` (Фильтрация строк) ⚡ _Здесь работают индексы_
3. `GROUP BY` (Группировка)
4. `HAVING` (Фильтрация групп)
5. `SELECT` (Выбор колонок)
6. `ORDER BY` (Сортировка)
7. `LIMIT` (Ограничение)

```sql
-- SELECT (Чтение)
SELECT id, name FROM users WHERE active = true;

-- INSERT (Создание)
INSERT INTO users (name, email) VALUES ('Alex', 'alex@test.com');

-- UPDATE (Обновление)
UPDATE users SET email = 'new@test.com' WHERE id = 1;

-- DELETE (Удаление)
DELETE FROM users WHERE id = 1;
```

**2. JOIN (Объединение таблиц):**

- **INNER JOIN:** Только совпадающие записи в обеих таблицах.
- **LEFT JOIN:** Все записи из левой таблицы + совпадения из правой (если нет — `NULL`).
- **RIGHT/FULL JOIN:** Встречаются реже, обычно решаются через `LEFT JOIN`.
```sql
-- SELECT (Чтение)
SELECT users.name, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```
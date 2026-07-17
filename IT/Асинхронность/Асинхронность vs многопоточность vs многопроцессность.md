#flashcards/Асинхронность
Асинхронность vs многопоточность vs многопроцессность ?  :: В Python есть три подхода для параллельной работы:<br>1. **Асинхронность (asyncio)**<br>**Для:** I/O-bound задачи (сеть, БД, файлы)<br>**Как:** Один поток, кооперативная многозадачность через `async/await`<br>**Плюсы:** Эффективно для множества соединений, мало потребление памяти<br>**Минусы:** Сложная отладка, блокирующий код ломает всё<br><br>2. **Многопоточность (threading)**<br>**Для:** I/O-bound задачи<br>**Как:** Несколько потоков в одном процессе, GIL ограничивает<br>**Плюсы:** Проще чем asyncio, подходит для задач с ожиданием<br>**Минусы:** GIL мешает для CPU-bound, race conditions<br><br>3. **Многопроцессность (multiprocessing)**<br>**Для:** CPU-bound задачи (вычисления, обработка данных)<br>**Как:** Несколько процессов, обходит GIL<br>**Плюсы:** Настоящий параллелизм для вычислений<br>**Минусы:** Высокое потребление памяти, сложный обмен данными<br><br>**Пример выбора:**<br>- Веб-сервер с 1000 соединений → **asyncio**<br>- Загрузка множества файлов → **threading**<br>- Обработка изображений/видео → **multiprocessing**
<!--SR:!2026-04-04,19,250-->

![[Pasted image 20260204221019.png]]

**Подтермины**
- **Race condition** (состояние гонки) — ситуация, когда **два или более процесса/потока/корутины** одновременно обращаются к **общему ресурсу** (переменной, файлу, записи БД), и **финальный результат зависит от порядка их выполнения**, который непредсказуем. В асинхронном Python чаще возникает при работе с `asyncio`, когда корутины совместно используют изменяемые данные.

```python
# без асинхроннсти
import time
from my_deco import time_counter

N = 5
DELAY = 0.5


def func1(n):
   for i in range(n):
       time.sleep(DELAY)
       print(f'--- line #{i} from {n} is completed')


def func2(n):
   for i in range(n):
       time.sleep(DELAY)
       print(f'=== line #{i} from {n} is completed')


@time_counter
def main():
   func1(N)
   func2(N)
   print(f'All functions completed')


if __name__ == '__main__':
   main()
   
#--- line #0 from 5 is completed
#--- line #1 from 5 is completed
#--- line #2 from 5 is completed
#--- line #3 from 5 is completed
#--- line #4 from 5 is completed
#=== line #0 from 5 is completed
#=== line #1 from 5 is completed
#=== line #2 from 5 is completed
#=== line #3 from 5 is completed
#=== line #4 from 5 is completed
#Total time: 5.0070641040802 → время выполнения 5 секунд
```


Уровень знания данной темы: ознакомлен
Доучить

-------------------------------------------------   
## Многопоточность (threading)
делаем декоратор в отдельном файле
```python
# my_deco.py в той же папке что и основной код
import time
import functools
from functools import wraps

def time_counter(func):
   @functools.wraps(func)
   def wrap():
       start = time.time()
       print("======== Script started ========")
       func()
       print(f"Time end: {time.strftime('%X')}")
       print(f'======== Script execution time: {time.time() - start:0.3f} ========')

   return wrap
```

Пишем основной код
```python
# черновик.py
# Thread
import time
from threading import Thread
from my_deco import time_counter

N = 5
DELAY = 0.5


def func1(n):
   for i in range(n):
       time.sleep(DELAY)
       print(f'--- line #{i} from {n} is completed')


def func2(n):
   for i in range(n):
       time.sleep(DELAY)
       print(f'=== line #{i} from {n} is completed')


@time_counter
def main():
   thread1 = Thread(target=func1, args=(N,))
   thread2 = Thread(target=func2, args=(N,))
   thread1.start()
   thread2.start()
   print(f'All functions completed')


if __name__ == '__main__':
   main()
   
#======== Script started ========
#All functions completed
#Time end: 22:39:48
#======== Script execution time: 0.002 ======== - время выолнения кода 0,002 секунды
# --- line #0 from 5 is completed
# === line #0 from 5 is completed
# --- line #1 from 5 is completed
# === line #1 from 5 is completed
#--- line #2 from 5 is completed
#=== line #2 from 5 is completed
#=== line #3 from 5 is completed
#--- line #3 from 5 is completed
#=== line #4 from 5 is completed
#--- line #4 from 5 is completed
```

---------------------------------------------------
## Асинхронность (asyncio)
также используем декоратор в отдельном файле, его под asyncio нужно переделывать!
```python
# my_deco.py в той же папке что и основной код
import time
import asyncio
from functools import wraps
from typing import Callable, Any

def async_time_counter(func: Callable) -> Callable:
    """
    Декоратор для измерения времени выполнения асинхронных функций.
    Выводит результат в формате:
    ======== Script started ========
    [результат функции]
    ======== Script execution time: X.XX ========
    """
    @wraps(func)
    async def wrapper(*args, **kwargs) -> Any:
        print("======== Script started ========")
        start_time = time.perf_counter()
        
        try:
            result = await func(*args, **kwargs)
        finally:
            end_time = time.perf_counter()
            execution_time = end_time - start_time
            
            # Выводим время выполнения
            print(f"======== Script execution time: {execution_time:.3f} ========")
        
        return result
    
    return wrapper
```

Пишем основной код
```python
# черновик.py
# asyncio
import time
import asyncio
from my_deco import async_time_counter

N = 5
DELAY = 0.5

async def func1(n):
   for i in range(n):
       await asyncio.sleep(DELAY)
       print(f'--- line #{i} from {n} is completed')

async def func2(n):
   for i in range(n):
       await asyncio.sleep(DELAY)
       print(f'=== line #{i} from {n} is completed')

@async_time_counter
async def main():
   print(f'All functions completed')

async def run():
   task0 = asyncio.create_task(main())
   task1 = asyncio.create_task(func1(N))
   task2 = asyncio.create_task(func2(N))
   await task0
   await task1
   await task2


if __name__ == '__main__':
   asyncio.run(run())

# ======== Script started ========
# All functions completed
# ======== Script execution time: 0.000 ======== - время выполнения еще улучшилось!
# --- line #0 from 5 is completed
# === line #0 from 5 is completed
# --- line #1 from 5 is completed
# === line #1 from 5 is completed
# --- line #2 from 5 is completed
# === line #2 from 5 is completed
# --- line #3 from 5 is completed
# === line #3 from 5 is completed
# --- line #4 from 5 is completed
# === line #4 from 5 is completed
```
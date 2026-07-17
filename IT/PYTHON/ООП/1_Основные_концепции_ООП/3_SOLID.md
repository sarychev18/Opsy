SOLID — это **5 принципов объектно-ориентированного программирования**, которые делают код более понятным, гибким и поддерживаемым.
- **S**RP — один класс = одна ответственность
- **O**CP — открыт для расширения, закрыт для изменений
- **L**SP дочерние классы должны заменять родительские
- **I**SP — много специализированных интерфейсов лучше одного общего
- **D**IP — зависимости от абстракций, а не от конкретных классов

**Ключевой акцент:** SOLID помогает писать код, который легко тестировать, расширять и поддерживать, что критически важно в коммерческой разработке.



#flashcards/Основы/шаблон
что за вопрос ?  :: тут ответ напиши
<!--SR:!2026-06-22,181,310-->

## 1 . SRP (Single Responsibility Principle)
### Принцип единственной ответственности

**Определение:** Класс должен иметь только одну причину для изменения.
**Проще:** Один класс = одна зона ответственности.

**Пример нарушения:**
```python
class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email
    
    def get_user_info(self) -> str:
        return f"{self.name} <{self.email}>"
    
    def save_to_database(self) -> None:
        # Логика сохранения в БД
        pass
    
    def send_email(self, message: str) -> None:
        # Логика отправки email
        pass
print(config.database_url)  # Всегда один и тот же объект

Проблема: Класс `User` отвечает и за данные пользователя, и за работу с БД, и за отправку писем.

Решение:
class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email
    
    def get_user_info(self) -> str:
        return f"{self.name} <{self.email}>"

class UserRepository:
    def save(self, user: User) -> None:
        # Логика сохранения в БД
        pass

class EmailService:
    def send_email(self, user: User, message: str) -> None:
        # Логика отправки email
        pass
```

## 2. OCP (Open-Closed Principle)

### Принцип открытости/закрытости

**Определение:** Классы должны быть открыты для расширения, но закрыты для модификации.

**Проще:** Добавляем новую функциональность через наследование/композицию, а не изменяя существующий код.

**Пример нарушения:**
```python
class AreaCalculator:
    def calculate_area(self, shape):
        if isinstance(shape, Circle):
            return 3.14 * shape.radius ** 2
        elif isinstance(shape, Rectangle):
            return shape.width * shape.height
        # Добавляем новый elif для каждой новой фигуры

Проблема: При добавлении новой фигуры нужно изменять существующий код.

Решение:
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius
    
    def area(self) -> float:
        return 3.14 * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height
    
    def area(self) -> float:
        return self.width * self.height

class AreaCalculator:
    def calculate_area(self, shape: Shape) -> float:
        return shape.area()  # Не нужно изменять при добавлении новых фигур
```
## 3. LSP (Liskov Substitution Principle)

### Принцип подстановки Барбары Лисков

**Определение:** Дочерние классы должны быть способны заменить родительские классы без изменения корректности программы.

**Проще:** Наследники не должны "ломать" поведение родителя.

**Пример нарушения:**
```python
class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height
    
    def set_width(self, width: float):
        self.width = width
    
    def set_height(self, height: float):
        self.height = height
    
    def area(self) -> float:
        return self.width * self.height

class Square(Rectangle):
    def __init__(self, size: float):
        super().__init__(size, size)
    
    def set_width(self, width: float):
        self.width = width
        self.height = width  # Нарушает поведение прямоугольника
    
    def set_height(self, height: float):
        self.height = height
        self.width = height  # Нарушает поведение прямоугольника

Проблема: Квадрат не может заменить прямоугольник, т.к. меняет его поведение.

Решение:
class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height
    
    def area(self) -> float:
        return self.width * self.height

class Square(Shape):
    def __init__(self, size: float):
        self.size = size
    
    def area(self) -> float:
        return self.size ** 2
```

## 4. ISP (Interface Segregation Principle)

### Принцип разделения интерфейсов

**Определение:** Много специализированных интерфейсов лучше, чем один универсальный.

**Проще:** Клиенты не должны зависеть от методов, которые они не используют.

**Пример нарушения:**
```python
class Worker(ABC):
    @abstractmethod
    def work(self) -> None:
        pass
    
    @abstractmethod
    def eat(self) -> None:
        pass

class Robot(Worker):
    def work(self) -> None:
        print("Robot working")
    
    def eat(self) -> None:  # Робот не ест!
        raise NotImplementedError("Robots don't eat!")

**Проблема:** Робот вынужден реализовывать ненужный метод `eat()`.

**Решение:**
class Workable(ABC):
    @abstractmethod
    def work(self) -> None:
        pass

class Eatable(ABC):
    @abstractmethod
    def eat(self) -> None:
        pass

class Human(Workable, Eatable):
    def work(self) -> None:
        print("Human working")
    
    def eat(self) -> None:
        print("Human eating")

class Robot(Workable):
    def work(self) -> None:
        print("Robot working")
```

## 5. DIP (Dependency Inversion Principle)

### Принцип инверсии зависимостей

**Определение:** Зависимости должны строиться на абстракциях, а не на конкретных реализациях.

**Проще:** Завись от интерфейсов, а не от классов.

**Пример нарушения:**
```python
class MySQLDatabase:
    def connect(self):
        print("Connecting to MySQL")

class Application:
    def __init__(self):
        self.database = MySQLDatabase()  # Жесткая зависимость
    
    def start(self):
        self.database.connect()

**Проблема:** При смене БД нужно переписывать код приложения.

**Решение:**
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def connect(self) -> None:
        pass

class MySQLDatabase(Database):
    def connect(self) -> None:
        print("Connecting to MySQL")

class PostgreSQLDatabase(Database):
    def connect(self) -> None:
        print("Connecting to PostgreSQL")

class Application:
    def __init__(self, database: Database):  # Зависимость от абстракции
        self.database = database
    
    def start(self):
        self.database.connect()

# Использование:
app = Application(PostgreSQLDatabase())  # Легко заменить реализацию
app.start()
```


#flashcards/ООП 
Какие ещё бывают принципы структурирования кода схожими с ООП? :: DRY (Don't Repeat Yourself) — избегай повторения кода<br>KISS (Keep It Simple, Stupid) — делай просто<br>YAGNI (You Aren't Gonna Need It) — не добавляй функциональность заранее<br>SoC (Separation of Concerns) — разделяй ответственность<br>SOLID — пять принципов ООП-дизайна
<!--SR:!2026-04-30,38,172-->

#flashcards/Основы/шаблон
Отличие copy() от deepcopy()?  :: copy() создает поверхностную копию, а deepcopy() глубокую, которую можно тоже поменять, но не измениться вложенный мутабельный объект. <br>Пример если при копировании списка с вложенным списком скопировать через copy(), то при изменении вложенного списка в некопии, поменяется и в копии. При копировании нужно быть осторожным, чтобы не было вложенных мутабельных элементов. Еще deepcopy() дольше и занимает больше памяти. Нужно еще импортировать модуль copy
<!--SR:!2026-06-07,129,250-->


```python
# config.py
import copy

original = [1, 2, [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

print(f"Original: {original}")      # [1, 2, [3, 4]]
print(f"Shallow: {shallow}")        # [1, 2, [3, 4]]

# Изменяем элемент верхнего уровня - влияет только на одну копию
original[0] = 100
print(f"After changing top-level:")
print(f"Original: {original}")      # [100, 2, [3, 4]]
print(f"Shallow: {shallow}")        # [1, 2, [3, 4]] - не изменился
print(f"Deep: {deep}")              # [1, 2, [3, 4]] - не изменился

# Изменяем вложенный список - влияет на ОБЕ копии!
original[2][0] = 300
print(f"After changing nested:")
print(f"Original: {original}")      # [100, 2, [300, 4]]
print(f"Shallow: {shallow}")        # [1, 2, [300, 4]] - изменился!
print(f"Deep: {deep}")              # [1, 2, [3, 4]] - не изменился!
```

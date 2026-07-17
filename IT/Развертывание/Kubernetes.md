## К тебе пришли с задачей

> "Разверни приложение в Kubernetes. В проекте SFMShop нужно развернуть FastAPI приложение в Kubernetes для продакшена. Нужно понять базовые концепции Kubernetes: pods, services, deployments, и как настроить масштабирование приложения."

_**Тимлид**_ показывает тебе ситуацию:

CODE

Копировать

```plaintext
В проекте SFMShop нужно:
- Развернуть приложение в Kubernetes
- Настроить масштабирование
- Обеспечить отказоустойчивость

Проблема: нет понимания Kubernetes
Нужно изучить базовые концепции
```

**Проблема:**

- Нет понимания Kubernetes
- Нужно развернуть приложение в продакшене
- Нужно настроить масштабирование

Нужно изучить _**Kubernetes (k8s)**_ - базовые концепции оркестрации контейнеров, pods, services, deployments и масштабирование.

В прошлом уроке мы изучили Docker и Docker Compose. Теперь мы узнаем про _**Kubernetes**_ - базовые концепции оркестрации контейнеров для продакшена.

---

## Что такое Kubernetes

_**Kubernetes (k8s)**_ - это платформа для оркестрации контейнеров, которая автоматизирует развертывание, масштабирование и управление приложениями.

### Зачем нужен Kubernetes

**Проблемы без Kubernetes:**

- Ручное управление контейнерами
- Сложность масштабирования
- Нет автоматического восстановления
- Сложность балансировки нагрузки

Автоматическое управление контейнерами. Автоматическое масштабирование. Автоматическое восстановление при сбоях. Балансировка нагрузки.

Используется для развертывание приложений в продакшене, масштабирование, обеспечение отказоустойчивости.

---

## Базовые концепции

### Pods

_**Pod**_ - это минимальная единица развертывания в Kubernetes, которая содержит один или несколько контейнеров.

yaml

Копировать

```plaintext
apiVersion: v1
kind: Pod
metadata:
  name: sfmshop-pod
spec:
  containers:
  - name: app
    image: sfmshop:latest
    ports:
    - containerPort: 8000
```

`kind: Pod` - определение типа ресурса. `containers` - список контейнеров в pod. `image` - Docker-образ для контейнера. `ports` - порты контейнера.

Используется для создания базового pod для приложения.

---

### Services

_**Service**_ - это абстракция, которая обеспечивает доступ к pods через сеть.

yaml

Копировать

```plaintext
apiVersion: v1
kind: Service
metadata:
  name: sfmshop-service
spec:
  selector:
    app: sfmshop
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

`selector` - выбор pods по меткам. `ports` - проброс портов. `type: LoadBalancer` - тип сервиса для внешнего доступа.

Используется для обеспечение доступа к приложению через сеть.

---

### Deployments

_**Deployment**_ - это ресурс, который управляет pods и обеспечивает обновления и масштабирование.

yaml

Копировать

```plaintext
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sfmshop-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sfmshop
  template:
    metadata:
      labels:
        app: sfmshop
    spec:
      containers:
      - name: app
        image: sfmshop:latest
        ports:
        - containerPort: 8000
```

`replicas: 3` - количество копий приложения. `template` - шаблон для создания pods. Deployment автоматически управляет pods.

Используется для развертывание и управление приложением.

---

## Масштабирование

### Горизонтальное масштабирование (replicas)

yaml

Копировать

```plaintext
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sfmshop-deployment
spec:
  replicas: 5  # 5 копий приложения
  # ...
```

`replicas: 5` создает 5 копий приложения. Kubernetes автоматически распределяет нагрузку. При сбое одного pod создается новый.

Используется для масштабирование приложения для обработки большей нагрузки.

---

### Horizontal Pod Autoscaling (базово, упоминание)

_**Horizontal Pod Autoscaling (HPA)**_ - это автоматическое масштабирование на основе метрик.

yaml

Копировать

```plaintext
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sfmshop-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sfmshop-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

HPA автоматически масштабирует deployment. `minReplicas: 2` - минимальное количество pods. `maxReplicas: 10` - максимальное количество pods. Масштабирование на основе использования CPU.

Используется для автоматическое масштабирование при росте нагрузки.

---

## Развертывание приложения

### Базовое развертывание

BASH

Копировать

```bash
# Применить конфигурацию
kubectl apply -f deployment.yaml

# Проверить статус
kubectl get pods
kubectl get services
kubectl get deployments

# Просмотр логов
kubectl logs -f sfmshop-pod
```

`kubectl apply` применяет конфигурацию. `kubectl get` показывает статус ресурсов. `kubectl logs` показывает логи pod.

Используется для развертывание и управление приложением в kubernetes.

---

## Решение задачи

Теперь мы можем решить задачу! Давай создадим базовую конфигурацию Kubernetes для проекта SFMShop.

**Создание deployment.yaml:**

yaml

Копировать

```plaintext
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sfmshop-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sfmshop
  template:
    metadata:
      labels:
        app: sfmshop
    spec:
      containers:
      - name: app
        image: sfmshop:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          value: "postgresql://user:password@db:5432/sfmshop"
        - name: REDIS_URL
          value: "redis://redis:6379"
```

**Создание service.yaml:**

yaml

Копировать

```plaintext
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: sfmshop-service
spec:
  selector:
    app: sfmshop
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

Deployment развертывает 3 копии приложения. Service обеспечивает доступ к приложению. Приложение масштабируется и автоматически восстанавливается.

Автоматическое управление контейнерами. Масштабирование при росте нагрузки. Автоматическое восстановление при сбоях. Отказоустойчивость.
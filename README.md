# Асинхронная обработка http запросов

### Проект создан в учебных и демонстрационных целях.

### Описание проекта:
• Express.js предоставляет форму для отправки HTTP POST запроса, с последующим его приемом.

• Запрос ретранслируется в [sender](./src/services/sender.js), где формируется задание в очередь ``tasks``, и поток [sender](./src/services/sender.js) ставиться на ожидание результата, который должен прийти в очередь ``res_tasks``.

• Для обработки заданий паралельно с сервером запускается поток [receiver](./src/services/receiver.js).

• После завершения обработки заданий из очереди ``tasks`` потоком [receiver](./src/services/receiver.js) результат направляется в очередь ``res_tasks``

• Поток [sender](./src/services/sender.js), находящийся на ожидании результата из очереди ``res_tasks``, возвращает результат в виде ответа для POST запроса на страницу пользователя.

• Реализован endpoint POST ``/api/tasks``, который принимает JSON с ключом number

**Пример запроса:** 
```
curl --location 'http://localhost:5000/api/tasks' \
--header 'Content-Type: application/json' \
--data '{
    "number": 123
}'
```
Ответ:
```
{ 
  "status": 200, 
  "data": 246 
}
```

<hr>

### Запускаем проект локально

1. Убедитесь, что у вас установлен [Node.js](https://nodejs.org/en), [Erlang](https://www.erlang.org/downloads) и [RabbitMQ](https://www.rabbitmq.com/download.html)
2. Склонируйте репозиторий: 
```
git clone https://github.com/monstrikwho/nodejs-rabbitmq.git
```
3. Перейдите в каталог проекта: 
```
cd nodejs-rabbitmq
```
4. Установите зависимости для основного проекта: 
```
npm install
```
5. Запустите проект 
```
npm run dev
```
6. Откройте страницу в браузере [localhost](http://localhost:5000)

<hr>

### Разворачиваем RabbitMQ
````js
docker run -d --hostname rmq --name rabbit-server -p 8080:15672 -p 5672:5672 rabbitmq:3-management
````

<hr>

### Разворачиваем приложение
```
docker build -t microservices .
```
```
docker run --name node-mic -p 5000:5000 -itd microservices
```

<!-- ```docker-compose --project-name microservices up``` -->
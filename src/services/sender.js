const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");

const rabbitmqUrl = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

exports.sendToQueue = (input) => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await amqp.connect(rabbitmqUrl);
      const channel = await connection.createChannel();

      const queue = process.env.QUEUE;
      const resQueue = process.env.RES_QUEUE;

      const correlationId = uuidv4();

      // Проверка существования очереди заданий
      channel.assertQueue(queue, { durable: true });

      // Отправляем задание в очередь
      channel.sendToQueue(queue, Buffer.from(JSON.stringify({ input })), {
        persistent: true,
        correlationId: correlationId,
      });

      console.log(`[Sender] Отправляет '${input}' в очередь ${queue}`);

      // Проверка существования очереди ответа
      channel.assertQueue(resQueue, {
        durable: true,
        arguments: { "x-message-ttl": 3600000 },
      });

      // Получение ответа от микросервиса Receiver
      channel.consume(
        resQueue,
        (msg) => {
          if (msg.properties.correlationId == correlationId) {
            const { result } = JSON.parse(msg.content.toString());

            console.log(
              `[Sender] Получает результат из очереди ${resQueue}: %O`,
              result
            );

            // Подтверждение получения сообщения
            channel.ack(msg);

            resolve(result);
          }
        },
        { noAck: false }
      );

      // Закрытие соединения с RabbitMQ через 10 секунд
      setTimeout(() => {
        connection.close();
        reject({
          status: 504,
          message: "Timeout: Превышено время ожидания обработки запроса",
        });
      }, 10000);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

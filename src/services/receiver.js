require("dotenv").config();
const amqp = require("amqplib");
const delay = require("../utils/delay");

const rabbitmqUrl = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

async function startWorker() {
  console.log("[Receiver] Worker is running");
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    const queue = process.env.QUEUE;
    const resQueue = process.env.RES_QUEUE;

    // Проверка существования очереди заданий
    channel.assertQueue(queue, { durable: true });

    // Обрабатываем одновременно одно сообщение
    channel.prefetch(1);

    console.log(`[Receiver] Ожидает задания в очереди ${queue}.`);

    channel.consume(queue, async (msg) => {
      const { input } = JSON.parse(msg.content.toString());

      console.log(`[Receiver] Получает задание из очереди ${queue} %O`, input);

      // Имитация задержки перед обработкой сообщения
      await delay(5000);

      // Подтверждение обработки сообщения
      channel.ack(msg);

      // Проверка существования очереди ответа
      channel.assertQueue(resQueue, {
        durable: true,
        arguments: { "x-message-ttl": 3600000 },
      });

      // Обработка входных данных и отправка результата в другую очередь
      const doubledNumber = input * 2;

      console.log(`[Receiver] Результат выполнения: %O`, doubledNumber);

      channel.sendToQueue(
        resQueue,
        Buffer.from(JSON.stringify({ result: doubledNumber })),
        {
          persistent: true,
          correlationId: msg.properties.correlationId,
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
}

startWorker();

const amqp = require("amqplib/callback_api");

amqp.connect(process.env.RABBITMQ_URL, async (err, connection) => {
  if (err) throw err;

  try {
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.QUEUE, {
      durable: false,
    });

    console.log("Waiting for messages in ", process.env.QUEUE);

    channel.consume(
      process.env.QUEUE,
      (msg) => {
        if (msg.content) {
          console.log("Получили таск: ", msg.content.toString());

          setTimeout(async () => {
            const number = parseInt(msg.content.toString());
            const result = number * 2;

            console.log("Таска отработанна: ", result);
          }, 5000);
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.log(error);
  }
});

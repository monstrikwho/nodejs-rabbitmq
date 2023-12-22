const { Router } = require("express");
const amqp = require("amqplib/callback_api");

const router = Router();

router.post("/", async (req, res) => {
  const { number } = req.body;

  if (isNaN(number)) {
    return res.status(400).send("Invalid number");
  }

  // sendToQueue(number);

  res.status(200).send({ status: true, message: "Таска отправлена" });
});

// function sendToQueue(number) {
//   amqp.connect(process.env.RABBITMQ_URL, async (err, connection) => {
//     if (err) throw err;

//     try {
//       const channel = await connection.createChannel();

//       await channel.assertQueue(process.env.QUEUE, {
//         durable: false,
//       });

//       channel.sendToQueue(process.env.QUEUE, Buffer.from(number.toString()));

//       console.log("Отправляем таск: ", number);
//     } catch (error) {
//       console.log(error);
//     }
//   });
// }

module.exports = router;

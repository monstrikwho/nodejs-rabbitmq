const { sendToQueue } = require("../services/sender");

exports.new = async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.send({ status: 400, message: "Field number is required" });
  }

  if (isNaN(number)) {
    return res.send({ status: 400, message: "Invalid number" });
  }

  // Обработка очереди и ожидание результата
  try {
    const data = await sendToQueue(number);
    res.send({ status: 200, data });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

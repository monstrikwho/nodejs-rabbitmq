const cors = require("cors");
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", require("../routes/tasks"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

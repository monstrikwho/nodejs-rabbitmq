const { Router } = require("express");
const router = Router();

router.use("/tasks", require("./tasks"));

module.exports = router;

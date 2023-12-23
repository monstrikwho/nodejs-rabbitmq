const { Router } = require("express");
const tasksController = require("../../controllers/tasks.controller");

const router = Router();

router.post("/", tasksController.new);

module.exports = router;

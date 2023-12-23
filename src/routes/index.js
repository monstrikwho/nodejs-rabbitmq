const { Router } = require("express");
const router = Router();

router.use("/api", require("./api"));

router.get("/", function (req, res) {
  res.render("index", { title: "NodeJS Microservices" });
});

module.exports = router;

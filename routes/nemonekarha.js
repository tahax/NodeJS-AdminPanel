const { Router } = require("express");

const router = new Router();

router.get("/nemonekarha", (req, res, next) => {
  res.render("maghalat", { pageTitle: "نمونه کارها" });
});

module.exports = router;

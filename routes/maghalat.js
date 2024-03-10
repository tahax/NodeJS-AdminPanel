const { Router } = require("express");

const router = new Router();

router.get("/blog", (req, res, next) => {
  res.render("blog", { pageTitle: " مقالات", path: "blog" });
});

module.exports = router;

const { Router } = require("express");

const userController = require("../controller/userController");
const { authenticated } = require("../middlewares/auth");

const router = new Router();

router.get("/signinpanel", userController.signin);

router.post(
  "/signinpanel",
  userController.handleLogin,
  userController.rememberMe
);

router.get("/logout", authenticated, userController.logout);

module.exports = router;

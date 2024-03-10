const { Router } = require("express");

const userController = require("../controller/userController");

const router = new Router();

router.get("/signup", userController.signup);

router.post("/signup", userController.createUser);

module.exports = router;

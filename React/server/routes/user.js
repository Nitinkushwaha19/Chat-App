const express = require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../Controller/users.js");

router.get("/:userId",wrapAsync(userController.getUser));

router.get("/",wrapAsync(userController.findUser));

router.route("/signup").post(wrapAsync(userController.signup));

router.post('/login', passport.authenticate('local'), wrapAsync(userController.login));

router.post("/logout", userController.logout);

module.exports = router;

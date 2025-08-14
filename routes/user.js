const express = require('express');
const router = express.Router();
const passport = require("passport");
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectURL } = require('../middlewares.js');
const userController=require("../controller/user.js");
//user route 

router.get("/signup", userController.signUpform)
router.post("/signup", wrapAsync(userController.saveUser));

router.get("/login", userController.loginForm);

router.post("/login",saveRedirectURL,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.postLogin)

router.get("/logout", userController.logOut);


module.exports = router;
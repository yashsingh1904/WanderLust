const express = require('express');
const router = express.Router();
const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
//user route 

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");

})
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;


        let newuser = {
            email: email,
            username: username,
        }
        const registeredUser = await User.register(newuser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", `Welcome To WanderLust ${username}`);
            res.redirect("/listings");

        })

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }



}))

router.get("/login", (req, res) => {
    res.render("user/login.ejs");


})

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    let { username } = req.body;
    req.flash("success", `Welcome Back ${username}`);
    res.redirect("/listings");


})

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", "Unable to Logout, Try Again");
            res.redirect("/listings");
        }
        else {
            req.flash("success", "Logout Succesfully !");
            res.redirect("/listings");
        }
    })

})


module.exports = router;
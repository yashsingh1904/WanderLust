const User = require("../models/user.js");
const LocalStartegy = require("passport-local");


module.exports.saveUser=async (req, res) => {
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



}

module.exports.logOut=async(req, res) => {
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

}
module.exports.postLogin=async(req, res) => {
    let { username } = req.body;
    req.flash("success", `Welcome Back ${username}`);
    
    if(res.locals.redirectURL){
            res.redirect(res.locals.redirectURL);

    }
    else{
        res.redirect("/listings");
    }


}
module.exports.loginForm=(req, res) => {
    res.render("user/login.ejs");


}
module.exports.signUpform=(req, res) => {
    res.render("user/signup.ejs");

}
require('dotenv').config()
console.log(process.env.ATLAS_URL); 

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const ejsmate = require('ejs-mate');
const listing = require("./routes/listings.js")
const reviews = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");
const wrapAsync = require('./utils/wrapAsync.js');

let db_URL=(process.env.ATLAS_URL)


app.use(methodOverride("_method"));

// use ejs-locals for all ejs templates:

app.engine('ejs', ejsmate);

app.use(express.static(path.join(__dirname, "/public")));
main()
    .then((res) => {
        console.log("DB Connected SUccesfully");
    })
    .catch(err => console.log(err));
    


async function main() {
    await mongoose.connect(db_URL);

}

const store=MongoStore.create({
    mongoUrl:db_URL,
    crypto:{
        secret:"myxyz//nthop.//"
    },
    touchAfter:24*3600
});

store.on("error",(error)=>{
    console.log("Error in Session Store",error);

})

const sessionOption = {
    store,
    secret: "myxyz//nthop.//",
    resave: false,
    saveUninitialized: true,
    cookies: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.get("/", (req, res) => {

    res.send("App is working fine at root ")

})

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
})



//user route
app.use("/",userRoute);

//listing routes 
app.use("/listings", listing);

//reviews routes 
app.use("/listings/:id/review", reviews);

//error handling middleware is here 
app.use((err, req, res, next) => {
    let { statusCode = 500, message } = err;
    res.render("listings/error.ejs", { err });


})

//let start the server at port 8080
app.listen(8080, () => {
    console.log("App islistening at port 8080");

})
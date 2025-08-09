const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const ejsmate = require('ejs-mate');
const listing = require("./routes/listings.js")
const reviews = require("./routes/reviews.js");

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
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {

    res.send("App is working fine at root ")

})

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
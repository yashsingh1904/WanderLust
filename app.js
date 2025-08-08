const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const ejsmate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js");
const { ListingSchema,reviewSchema } = require('./Schema.js');
const Review=require("./models/reveiw.js")

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

// in app.js

const validateReview = (req, res, next) => {
    // THIS IS THE BEST DEBUGGING TRICK
    console.log("--- Validating Review ---");
    console.log("Request Body Received:", req.body); 
    
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        console.log("Validation Error:", errmsg);
        throw new ExpressError(400, errmsg); // Use 400 for a bad request
    } else {
        console.log("Validation Passed");
        next();
    }
}

app.get("/", (req, res) => {

    res.send("App is working fine at root ")

})


app.get("/listings", wrapAsync(async (req, res) => {

    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })

}))

app.get("/listings/new",(req,res)=>{

    res.render("listings/form.ejs");

})



//show route 
app.get("/listings/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const listingData = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listingData });

}))


//Create Route
//post route to get infromation of new property via form 

app.post("/listings", wrapAsync(async (req, res) => {
    let result=ListingSchema.valid(req.body);
    console.log(result.error);
    


    const newdata = new Listing(req.body.listing);
    await newdata.save();
    res.redirect("/listings")
}))



//edit route 
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id);
    res.render("listings/edit.ejs", { listingData });


}))


//update route 
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);


}))

//delete Route 
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listings")

}))


//Reveiw Routes 

// Review Post route 
app.post("/listings/:id/review",validateReview,async(req,res)=>{
        let { id } = req.params;

    const listingData = await Listing.findById(id);
    const newreview= new Review(req.body.review);
    listingData.reviews.push(newreview);
    await newreview.save();
    await listingData.save();
    // console.log(newreview);
    res.redirect(`/listings/${id}`);

    

    
})

//Review Delete Route 
app.delete("/listings/:id/review/:reviewID",wrapAsync(async(req,res)=>{
    const {id,reviewID}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}})
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/listings/${id}`);
}))

// //any other wrong route
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// });

//  app.all("*",(req,res,next)=>{
//      next(new ExpressError(501,"NO Random PageFound"));
//  })

app.get("/random",(req,res,next)=>{
    next(new ExpressError(501,"NO Random PageFound"));
})



//error handling middleware is here 
app.use((err, req, res, next) => {
    let { statusCode=500, message}=err;
    res.render("listings/error.ejs",{err});
    

})




//let start the server at port 8080
app.listen(8080, () => {
    console.log("App islistening at port 8080");

})
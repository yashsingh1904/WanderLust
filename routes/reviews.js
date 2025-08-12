const express = require('express');

const router = express.Router({ mergeParams: true });


const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js")

const { reviewSchema } = require('../Schema.js');
const Review = require("../models/reveiw.js")
const { isLoggedin } = require('../middlewares.js');







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


router.post("", isLoggedin, validateReview, async (req, res) => {
    let { id } = req.params;

    const listingData = await Listing.findById(id);
    const newreview = new Review(req.body.review);
    listingData.reviews.push(newreview);
    await newreview.save();
    await listingData.save();
    // console.log(newreview);
    req.flash("success", " Review Creataed !");

    res.redirect(`/listings/${id}`);




})

//Review Delete Route 

router.delete("/:reviewID", isLoggedin, wrapAsync(async (req, res) => {

    const { id, reviewID } = req.params;


    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review Delted ");

    res.redirect(`/listings/${id}`);
}))

module.exports = router;
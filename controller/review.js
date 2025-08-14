const Listing = require('../models/listing.js');
const Review = require("../models/reveiw.js")
module.exports.saveReview=async (req, res) => {
    let { id } = req.params;

    const listingData = await Listing.findById(id);
    const newreview = new Review(req.body.review);
    newreview.author=res.locals.currUser._id,
    listingData.reviews.push(newreview);
    await newreview.save();
    await listingData.save();
    // console.log(newreview);
    req.flash("success", " Review Creataed !");

    res.redirect(`/listings/${id}`);




}

module.exports.deleteReview=async (req, res) => {

    const { id, reviewID } = req.params;
    let rev= await Review.findById(reviewID);
    console.log(rev);
    
    if(!(rev.author._id.toString()===res.locals.currUser._id.toString())){
        req.flash("error","You are not the author of Review");
            return res.redirect(`/listings/${id}`);


    }


    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review Delted ");

    res.redirect(`/listings/${id}`);
}
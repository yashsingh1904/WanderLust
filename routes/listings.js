const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema } = require('../Schema.js')
const Listing = require('../models/listing.js');


router.get("", wrapAsync(async (req, res) => {

    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })

}))

router.get("/new", (req, res) => {

    res.render("listings/form.ejs");

})



//show route 
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const listingData = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listingData });

}))


//Create Route
//post routerouter get infromation of new property via form 

router.post("", wrapAsync(async (req, res) => {
    let result = ListingSchema.validate(req.body);
    console.log(result.error);



    const newdata = new Listing(req.body.listing);
    await newdata.save();
    res.redirect("/listings")
}))



//edit route 
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id);
    res.render("listings/edit.ejs", { listingData });


}))


//update route 
router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);


}))

//delete Route 
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listings")

}))

module.exports=router;
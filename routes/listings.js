const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema } = require('../Schema.js')
const Listing = require('../models/listing.js');
const { isLoggedin } = require('../middlewares.js');


router.get("", wrapAsync(async (req, res) => {

    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })

}))

router.get("/new",isLoggedin, (req, res) => {

    
    
            res.render("listings/form.ejs");

    


})



//show route 
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const listingData = await Listing.findById(id).populate("reviews");
    if(!listingData){
        req.flash("error","Listing you are accesing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listingData });

}))


//Create Route
//post routerouter get infromation of new property via form 

router.post("", isLoggedin,wrapAsync(async (req, res) => {
    let result = ListingSchema.validate(req.body);
    console.log(result.error);



    const newdata = new Listing(req.body.listing);
    await newdata.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings")
}))



//edit route 
router.get("/:id/edit", isLoggedin,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id);
    res.render("listings/edit.ejs", { listingData });


}))


//update route 
router.put("/:id",isLoggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
         req.flash("success"," Listing Updated Succesfully !");

    res.redirect(`/listings/${id}`);


}))

//delete Route 
router.delete("/:id",isLoggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
         req.flash("success"," Listing Deleted Succesfully !");

    res.redirect("/listings")

}))

module.exports=router;
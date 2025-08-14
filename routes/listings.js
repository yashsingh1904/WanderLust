const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema } = require('../Schema.js')
const Listing = require('../models/listing.js');
const { isLoggedin,isOwner } = require('../middlewares.js');
const listingController=require('../controller/listings.js')

router.route("")
.get(wrapAsync(listingController.index))
.post(isLoggedin,wrapAsync(listingController.saveListing));


router.get("/new",isLoggedin, listingController.renderForm)

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedin,isOwner, wrapAsync(listingController.saveUpdation))
.delete(isLoggedin,isOwner, wrapAsync(listingController.deleteListing))

router;


//edit route 
router.get("/:id/edit", isLoggedin,isOwner,wrapAsync(listingController.editForm));


module.exports=router;
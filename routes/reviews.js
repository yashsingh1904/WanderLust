const express = require('express');

const router = express.Router({ mergeParams: true });


const wrapAsync = require("../utils/wrapAsync.js")

const { reviewSchema } = require('../Schema.js');
const { isLoggedin } = require('../middlewares.js');
const reviewController=require("../controller/review.js");






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


router.post("", isLoggedin, validateReview,wrapAsync(reviewController.saveReview ));

//Review Delete Route 

router.delete("/:reviewID", isLoggedin, wrapAsync(reviewController.deleteReview));

module.exports = router;
const joi = require('joi');

module.exports.ListingSchema = joi.object({
    listings: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.object({
            url: joi.string().allow("", null),
        })


    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5).required(),
        Comment: joi.string().required(),

    }).required(),
});
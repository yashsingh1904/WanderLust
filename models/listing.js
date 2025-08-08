const mongoose = require('mongoose');
const Review = require('./reveiw');
const { ref } = require('joi');
const schema = mongoose.Schema;

const ListingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: "Review"
        }
    ]



})

ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })

    }


})


const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
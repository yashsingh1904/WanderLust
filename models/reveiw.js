const { string, number } = require('joi');
const mongoose = require('mongoose');
const schema=mongoose.Schema;

const reviewSchema=new schema({
    Comment:{
        type:String,
    },
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt_:{
        type:Date,
        dfeault:Date.now(),
    }

});

const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;
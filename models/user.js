const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalamongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type:String,
        required:true
    },
});

userSchema.plugin(passportLocalamongoose);
module.exports=mongoose.model("user",userSchema);
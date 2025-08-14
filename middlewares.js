const Listing = require('./models/listing.js');

module.exports.isLoggedin=(req,res,next)=>{
  
    if(!req.isAuthenticated()){
        req.session.redirectURL=req.originalUrl;
        //if user is not authenticated 
        req.flash("error","You Must Login !")
        return res.redirect("/login");
        
        
    }
    next();

}

module.exports.saveRedirectURL=(req,res,next)=>{
    res.locals.redirectURL=req.session.redirectURL;
    next();

}

module.exports.isOwner=async(req,res,next)=>{
     let { id } = req.params;
    let list=await Listing.findById(id);
    if(!(list.owner._id.toString() === res.locals.currUser._id.toString())){
        req.flash("error","You are not the Owner");
        return  res.redirect(`/listings/${id}`);

    }
    next();
}
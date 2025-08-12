module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //if user is not authenticated 
        req.flash("error","You Must Login !")
        return res.redirect("/login");
    }
    next();

}
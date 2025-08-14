const Listing = require('../models/listing.js');
const { ListingSchema } = require('../Schema.js')

module.exports.index=async (req, res) => {

    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })

}

module.exports.renderForm=(req, res) => {
    res.render("listings/form.ejs");
}

module.exports.showListing=async (req, res) => {

    let { id } = req.params;
const listingData = await Listing.findById(id)
  .populate("owner")
  .populate({
    path: "reviews",
    populate: {
      path: "author",
      model: "user"
    }
  });    if(!listingData){
        req.flash("error","Listing you are accesing does not exist");
        res.redirect("/listings");
    }
    
   
    
    res.render("listings/show.ejs", { listingData,currUser:req.user });

}

module.exports.saveListing=async(req, res) => {
    let result = ListingSchema.validate(req.body);
    console.log(result.error);



    const newdata = new Listing(req.body.listing);
    newdata.owner=req.user._id;
    await newdata.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings")
}
module.exports.editForm=async (req, res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id);
    res.render("listings/edit.ejs", { listingData });


}

module.exports.saveUpdation=async (req, res) => {
    let { id } = req.params;
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
         req.flash("success"," Listing Updated Succesfully !");

    res.redirect(`/listings/${id}`);


}

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    const deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
         req.flash("success"," Listing Deleted Succesfully !");

    res.redirect("/listings")

}
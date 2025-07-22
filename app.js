const express = require('express');
const mongoose = require('mongoose');
const Listing =require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const app=express();
const ejsmate = require('ejs-mate');
app.use(methodOverride("_method"));

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

main()
.then((res)=>{
    console.log("DB Connected SUccesfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    
    res.send("App is working fine at root ")

})


app.get("/listings", async (req,res)=>{

 const allListing=await Listing.find({});
 res.render("listings/index.ejs",{allListing})

})

app.get("/listings/new",(req,res)=>{

    res.render("listings/form.ejs");

})


//show route 
app.get("/listings/:id", async (req,res)=>{

    let {id}=req.params;
  const listingData = await  Listing.findById(id);
  res.render("listings/show.ejs",{listingData});

})

//post route to get infromation of new property via form 
app.post("/listings",async(req,res)=>{
    const newdata=new Listing(req.body.listing);

    
     await newdata.save();
    res.redirect("/listings")
    
})

//edit route 
app.get("/listings/:id/edit", async (req,res)=>{
    let {id}=req.params;
  const listingData = await  Listing.findById(id);
     res.render("listings/edit.ejs",{listingData});


})


//update route 
app.put("/listings/:id",async (req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`);


})

//delete Route 
 app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const deletedData= await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listings")
    
    })




// app.get('/testlisting', async (req,res)=>{

//     let newListing= new Listing({
//         title:"Hotel Lemon",
//         description:"A 100 room hotel with best interiror and  equiped with modern technologies",
//         price:100000,
//         location:"New Delhi",
//         Country:"India"
//     });

//     await newListing.save()
//     .then((result)=>{
//         console.log("Data Saved succesfully");
//         res.send(result)
        
//     })
//     .catch((err)=>{
//         console.log("error in saving data");
//         res.send("Error in saving Data");
//     })

    
// })





//let start the server at port 8080
app.listen(8080,()=>{
    console.log("App islistening at port 8080");
    
})
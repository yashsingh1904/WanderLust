require('dotenv').config()

console.log("ATLAS_URL from env:", process.env.ATLAS_URL);
const initData=require('./data');
const Listing= require('../models/listing.js');
const mongoose = require('mongoose');


const MONGO_URL = (process.env.ATLAS_URL)
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


const initDB= async ()=>{

    //clear if tehre is already any data left 
    await Listing.deleteMany({})
  initData.data=initData.data.map((obj)=>({
    ...obj,owner:"68a0d1304143cd13acb40d3b"


  }))
    await Listing.insertMany(initData.data);
    console.log("data was initialised");

    


};

initDB();
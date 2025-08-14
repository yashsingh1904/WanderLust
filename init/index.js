const mongoose = require('mongoose');
const initData=require('./data');
const Listing= require('../models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
    ...obj,owner:"689b30011544f57a1d973765"


  }))
    await Listing.insertMany(initData.data);
    console.log("data was initialised");

    


};

initDB();
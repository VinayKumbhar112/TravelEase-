const mongoose=require("mongoose");
const initdata=require("./data.js")
const Listing=require("../models/listing.js");

main().
then((res)=>{
  console.log("Connected|");
})
.catch((err)=>{
  console.log(err);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
};

const initdb= async ()=>{
  await Listing.deleteMany();
  initdata.data=initdata.data.map((obj)=>({...obj,owner:"6839bde1bbe6345fdf3e6340"}));
  await Listing.insertMany(initdata.data);
  console.log("db");
}
initdb();
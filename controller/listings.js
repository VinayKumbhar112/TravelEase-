const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAPS_API;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
    let sampledata = await Listing.find();
    res.render("./listings/listing.ejs", { sampledata });
  };
  module.exports.addlist=async (req, res) => {
    res.render("./listings/addlist.ejs");
  };

  module.exports.details=async (req, res) => {
    let { id } = req.params;
    let listingdata = await Listing.findById(id).populate({path:"reviews",populate: {
      path:"author",},
    }).populate("owner");
    if( ! listingdata){
  req.flash("error" ,"List does not exist!");
   res.redirect("http://localhost:8080/listings");
}else{
   if (listingdata.price == null) listingdata.price = 0;
    res.render("./listings/details.ejs", { listingdata });
}
console.log(listingdata);
  };

  module.exports.newlistform=async (req, res, next) => {
let response = await geocodingClient.forwardGeocode({
  query: req.body.location,
  limit: 1
}).send();



    let url=req.file.path;
    let filename=req.file.filename;
      let { title, description, price, location, country } = req.body;
  
      let newlisting = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
      });
      newlisting.owner=req.user._id;
      newlisting.image={url,filename};
      newlisting.geometry=response.body.features[0]?.geometry;
      let save=await newlisting.save();
      req.flash("success" ,"New List is Created!");
      res.redirect("http://localhost:8080/listings");
    };

    module.exports.edit=async (req, res) => {
        let { id } = req.params;
   
 console.log("Edit controller triggered for ID:", id);
        const listingdata = await Listing.findById(id);
    
        if(!listingdata){
      req.flash("error" ,"List does not exist!");
       res.redirect("http://localhost:8080/listings");
        }else{

          let originalimageurl=listingdata.image.url;
         originalimageurl= originalimageurl.replace("/upload","/upload/w_250");
        res.render("./listings/editlist.ejs", { listingdata ,originalimageurl});
        }
      };

      module.exports.editform=async (req, res) => {
          let { id } = req.params;
          let { title, description, price, location, country } = req.body;
  
         let listing= await Listing.findByIdAndUpdate(
            id,
            {
              title: title,
              description: description,
              price: price,
              location: location,
              country: country,
            },
            {
              runValidators: true,
              new: true,
            }
          );
          if (req.file) {
  const url = req.file.path;
  const filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
}
       
           req.flash("success" ,"List Updated!");
          res.redirect(`http://localhost:8080/listings/${id}`);
        };

        module.exports.delete1=async (req, res) => {
            let { id } = req.params;
            let found = await Listing.findByIdAndDelete(id);
            // console.log(found);
             req.flash("success" ,"List Deleted!");
            res.redirect("http://localhost:8080/listings");
          };
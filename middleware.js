const Listing = require("./models/listing.js");
const wrapasync = require("./utils/wrapasync.js");
const Expresserror = require("./utils/expresserror.js");
const { ListingSchema } = require("./schema.js");
const { reviewschema } = require("./schema.js");
const Review = require("./models/review.js");
module.exports.isAuthenticate=(req,res,next)=>{

  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged In");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveredirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isowner=  wrapasync(async (req, res,next) => {
    let { id } = req.params;
     console.log("Checking ownership for listing:", id);
    const listingdata = await Listing.findById(id);
    
if(String( listingdata.owner._id)!==  String(res.locals.curruser._id)){
  req.flash("error" ,"You are not owner of this listing.");
      res.redirect(`http://localhost:8080/listings/${id}`);
}next();});

module.exports.validatelisting = (req, res, next) => {
  const { error } = ListingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new Expresserror(400, errmsg);
  } else {
    next();
  }
};

module.exports.validatelisting2 = (req, res, next) => {
  const { error } = reviewschema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expresserror(400, errmsg);
  } else {
    next();
  }
};


module.exports.isauthor = wrapasync(async (req, res, next) => {
  const { reviewid, id } = req.params;
  console.log("Review ID param:", reviewid);  // ✅ should log the correct ID

  const review = await Review.findById(reviewid);  // ✅ use reviewid, not reviewId

  if (!review) {
    req.flash("error", "Review not found.");
    return res.redirect(`/listings/${id}`);
  }

  const authorId = review.author._id || review.author;

  if (!authorId.equals(res.locals.curruser._id)) {
    req.flash("error", "You are not allowed to delete.");
    return res.redirect(`/listings/${id}`);
  }

  next();
});

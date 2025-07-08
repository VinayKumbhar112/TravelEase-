const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.reviewform=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let { rating, comment } = req.body;
    let newreview = new Review({
      rating: rating,
      comment: comment,
    });
    newreview.author=req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log(req.body);
     req.flash("success" ,"Your Review Is added!");
    res.redirect(`http://localhost:8080/listings/${id}`);
  };

  module.exports.deletereview=async (req, res) => {
      let { id, reviewid } = req.params;
      await Review.findByIdAndDelete(reviewid);
       req.flash("success" ,"Review Deleted!");
      res.redirect(`http://localhost:8080/listings/${id}`);
    };
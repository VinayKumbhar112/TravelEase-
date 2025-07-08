const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync.js");
const Review = require("../models/review.js");
const { validatelisting2,isAuthenticate,isauthor}=require("../middleware.js");
const listingcontroller=require("../controller/review.js");
//delete
router.delete(
  "/:reviewid",isauthor,
  wrapasync(listingcontroller.deletereview)
);
//reviewform
router.post(
  "/",isAuthenticate,
  validatelisting2,
  wrapasync(listingcontroller.reviewform)
);
module.exports = router;

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync.js");
const Review = require("../models/review.js");
const {isAuthenticate,isowner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controller/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage });

//newlistform
router
.route("/")
.get(
  wrapasync(listingcontroller.index)
).post(
   isAuthenticate,
  validatelisting,
  upload.single('image'),
  wrapasync(listingcontroller.newlistform),
);

//addlist
router.get(
  "/addlisting",
  isAuthenticate,
  wrapasync(listingcontroller.addlist)
);
//edit
router.
route("/:id/edit").
get(
    isAuthenticate,isowner,
  wrapasync(listingcontroller.edit)
);

//delete
router.
route("/:id")
.get(
  isAuthenticate,
  wrapasync(listingcontroller.details)
).put(
  isowner,
   upload.single('image'),
  wrapasync(listingcontroller.editform)
)
.delete(
isowner,
  wrapasync(listingcontroller.delete1)
);



module.exports = router;

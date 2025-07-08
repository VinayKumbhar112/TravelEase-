const express = require("express");
const router = express.Router();
const passport=require("passport");
const LocalStrategy=require("passport-local");
const flash=require("connect-flash");
const {saveredirectUrl}=require("../middleware.js");
const listingcontroller=require("../controller/user.js");


router.
route("/signup")
.get(listingcontroller.signup)
.post(listingcontroller.signupform);

router.
route("/login").
get(listingcontroller.login)
.post(
  saveredirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  listingcontroller.loginform
);

router.get("/logout",listingcontroller.logout);

module.exports=router;
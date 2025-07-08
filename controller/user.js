const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const express = require("express");
const router = express.Router();
const passport=require("passport");
const LocalStrategy=require("passport-local");
const flash=require("connect-flash");
const {saveredirectUrl}=require("../middleware.js");
const listingcontroller=require("../controller/user.js");



module.exports.signup=async(req,res)=>{
  res.render("./user/signup.ejs");
};

module.exports.signupform= async (req,res)=>{
  try{
  let {username,email,password}=req.body;
  const newuser=new User({username,email});
  const registereduser= await User.register(newuser,password);
  console.log(registereduser);
  req.login(registereduser,(err)=>{
    if(err){
      return next(err);
    }
      req.flash("success","WLECOME TO WANDERLUST");
  res.redirect("/listings");
  });

}catch(e){
    console.log("Signup error:", e.message); 
  req.flash("error",e.message);
  res.redirect("/signup");
}};

module.exports.login=async(req,res)=>{
  res.render("./user/login.ejs")
};

module.exports.loginform=async(req, res) => {
      req.flash("success","WLECOME TO WANDERLUST");
      let redirecturl=res.locals.redirectUrl || "/listings";
    res.redirect(redirecturl);
  };
  module.exports.logout=async(req,res,next)=>{
  req.logout((err)=>{
    if(err){
    next(err);}
     req.flash("success","You are now logged Out!");
  res.redirect("/listings");
  });
 
};
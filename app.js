if(process.env.NODE_ENV !="production"){
 require('dotenv').config();

}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const flash=require("connect-flash");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userrouter=require("./routes/user.js");
const db_url=process.env.ATLASDB;


main()
  .then((res) => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(db_url);
}

const store=MongoStore.create({
  mongoUrl:db_url,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
});
  
app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() +7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }}));
  app.get('/', (req, res) => {
  res.redirect('/listings');
});

  app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curruser = req.user;
  next();

});



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",userrouter);

app.get("/", (req, res) => {
  res.redirect("./listings");
});
app.use((err, req, res, next) => {
  let { statuscode = 500, message = "something went wrong!" } = err;
  res.status(statuscode).render("./listings/error.ejs", { message });
});

app.listen(8080, (req, res) => {
  console.log("Server is listening to port 8080");
});

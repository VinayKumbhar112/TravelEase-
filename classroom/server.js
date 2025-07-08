const express=require("express");
const app=express();
const session=require("express-session");
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
 
}));
app.get("/",(req,res)=>{
  res.send("Working;");
});
app.listen("3000",()=>{
  console.log("listening to server 3000");
})
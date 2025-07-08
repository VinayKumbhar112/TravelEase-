const mongoose=require("mongoose");
const { Schema } = mongoose;
const reviewschema=new mongoose.Schema(
  {
    comment:String,
    rating:{
      type:Number,
      min:1,
      max:5
    },
    created_at:{
      type:Date,
      default:Date.now()
    },
      author:
    {
    type:Schema.Types.ObjectId,
    ref:"user",
  },

  }
);
module.exports=new mongoose.model("Review",reviewschema);
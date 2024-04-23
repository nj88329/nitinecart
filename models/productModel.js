const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "User"
     },
     name : {
          type: String,
          required : [ true , "Please add the product name"],
     },
     price : {
            type: Number,
            required : [ true ],
        },
     quantity : {
        type: Number,
            required : [ true , "Please add the quantities"],
            default : 1
    },
    image: {
        type: String,
      },
    galleryImages : {
        type : [Object]
    }
},
    {
        timestamps : true,
})


module.exports = mongoose.model("Product" , productSchema );

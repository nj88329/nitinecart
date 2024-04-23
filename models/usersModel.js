const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
     username : {
        type: String,
        required: [ true , "Please add the user name"],
        minlength:5
     },
     email:{
        type: String,
        required : [ true , "Please add the user email address"],
        unique : [true , "Email already taken" ]
     },
    password :{
        type : String,
        required : [true , "Please add the user password"],
        minlength : 8
    },
},
    {
        timestamps : true,
    }
);

module.exports = mongoose.model("Users" , usersSchema );

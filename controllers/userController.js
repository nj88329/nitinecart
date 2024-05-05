const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require('../models/usersModel');
var jwt = require('jsonwebtoken');

const getAllUsers = asyncHandler(async(req, res)=>{
   const users = await User.find();
   res.status(200).json(users);
   console.log('users', users)
})


const registerUser = asyncHandler(async(req,res)=>{
    const { username , email , password } = req.body;
    if( !username || !email || !password )
    {
       res.status(400);
        throw new Error("All fields are mandatory");
    }
       const userAvailable = await User.findOne({email});
          if(userAvailable) 
          {
            res.status(400);
            throw new Error("User already registered");
          }
          //hash password
          const hashedPassword = await bcrypt.hash(password , 10);
          console.log("hashed", hashedPassword);
        const user = await User.create({
           username ,
            email ,
            password :hashedPassword
        })
        console.log(`User created ${user}`);
        if( user )
        {
            res.status(201).json({ 
               _id : user.id , email : user.email
            });
        }          
         else{
            res.status(400);
            throw new Error("user data invalid");
         }
      //  res.json({message: "Register the user"});
    })

const loginUser = asyncHandler(async(req,res )=>{
        const { email, password } = req.body;
        if( !email || !password ) 
         {
           res.status(400);
             
         throw new Error("All fields are mandatory");
         } 
         const user = await User.findOne({email});
         if( !user )
         {
          res.status(401);
          throw new Error("User is not registered");
         }
       if( user && (await bcrypt.compare(password ,user.password )))
           {
             const accessToken = jwt.sign({
               user :{
                 username : user.username,
                email:user.email,
                id:user.id,
               },
             }, process.env.ACCESS_TOKEN_SECRET,
             { expiresIn : "45m" }
             );
              res.status(200).json({
                user ,
               accessToken
              });
              console.log('user', user._id );
              console.log('ki',accessToken);
           }else{
                res.status(401);
             throw new Error("email/password is not valid");
           }
    })

const currentUser = asyncHandler(async(req,res)=>{
        res.json(req.user);
        console.log('current' , req.user)
})

module.exports = { getAllUsers, registerUser , loginUser , currentUser };

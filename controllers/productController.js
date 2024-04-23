//@desc get all product
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const uniqId = require('uniqid');
const axios = require('axios');
const SHA256 = require('sha256');

// Testing Purpose
const PHONEPE_HOST_URL = 'https://api-preprod.phonepe.com/apis/hermes';
const Merchant_ID = 'PGTESTPAYUAT';
const Salt_Index = 1;
const Salt_Key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';

const getProducts = asyncHandler(async( req, res, err )=>{
    try {
        const products = await Product.find({ user_id: req.user.id });
        res.status(200).json(products);
      } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Internal server error' });
      }
});

const createProduct =  asyncHandler(async(req, res ) =>{
  
   const { name , price , quantity , image , galleryImages
   } = req.body ;
 
     if( !name || !price || ! quantity )
     {
      res.status(400).send("All fields are mandatory.");
      // throw new Error("All fields are mandatory.")
     }
   try{
     const product = await Product.create({
      name,
      price,
      quantity,
      image,
      galleryImages,
      user_id : req.user.id
     });
     res.status(201).json({product});
   }
    catch(err){
       res.status(400);
      console.log(err);
    }   
}
)
const updateProduct =  asyncHandler(async(req, res) =>{

    const product = await Product.findById(req.params.id); 
    if(!product)
    {
       res.status(404);
       throw new Error(" Product not found ");
    } 
    
      if(product.user_id.toString() !== req.user.id )
      {
         res.status(403);
         throw new error("user don't have permission to update other user.")
      }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new : true }
)
    res.status(200).json(updatedProduct);
})

const getProduct =  asyncHandler(async( req, res )=>{
    const product = await Product.findById(req.params.id);
    
     if(!product)
     {
        res.status(404);
      throw new Error(" Product not found ");
     }
   res.status(200).json(product);
});



const deleteProduct  =  asyncHandler(async(req, res) =>{
    const product = await Product.findById(req.params.id);
    if(!product)
    {
        res.status(404);
       console.log('not found')
        throw new Error("Product not found");
    }
       await Product.deleteOne({_id:req.params.id}); 
    res.status(200).json({ message:`Deleted Product : ${req.params.id}`});
});


const deleteAllProducts = asyncHandler(async(req, res)=>{

  try{
     const ProductsAll = await Product.find();
     if(  ProductsAll.length  > 0 )
     {
        let ProductsToRemove =  await Product.deleteMany({});
        console.log('Productsremove' , ProductsToRemove );
        res.status(201).json(ProductsToRemove);
     }
    }
    catch(err){
     console.log('err', err);
    }
 })




 const buyProduct = async(req, res)=>{

  const { amount , user_id } = req.body;
     console.log('item', amount )
  const payEndPoint = '/pg/v1/pay';
  const merchantTransactionId = uniqId();
  const userid = user_id ;
  const payload =  {
       merchantId:Merchant_ID,
       merchantTransactionId: merchantTransactionId,
       merchantUserId: user_id,
       amount : Math.round(amount)*100*80,
       redirectUrl: `http://localhost:3001`,    //  /redirect-url/${merchantTransactionId}
       redirectMode: 'GET',
       mobileNumber: '9999999999',
       paymentInstrument: {
         type: "PAY_PAGE"
       }      
 } 
 // SHA256(base64 encoded payload + "/pg/v1/pay" + salt key) + ### + salt index
   const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
   const base64EncodedPayload = bufferObj.toString("base64");
    const xVerify = SHA256(base64EncodedPayload + payEndPoint + Salt_Key)
        + "###" + Salt_Index  ;
 
        const options = {
          method: 'post',
          url: `${PHONEPE_HOST_URL}${payEndPoint}`,
          headers: {
                'accept' : 'application/json',
                'Content-Type': 'application/json',
                "X-VERIFY" : xVerify
                    },
        data: {
          request : base64EncodedPayload
        }
        };
        axios
          .request(options)
              .then(function (response) {
                const url = response.data.data.instrumentResponse.redirectInfo.url
                // res.status(200).json( response.data.data)
               res.send(url);
          })
          .catch(function (error) {
            console.error(error);
          });
 
 }


module.exports = { getProducts , createProduct , updateProduct , getProduct , deleteProduct , deleteAllProducts , buyProduct};
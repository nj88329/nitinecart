const express = require('express');
const router = express.Router();


const { getProducts ,
     createProduct , 
     updateProduct , 
     getProduct , 
     deleteProduct, 
     deleteAllProducts ,
     buyProduct
    } = require("../controllers/productController");

    
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

router.route('/').get(getProducts).delete(deleteAllProducts);


router.post('/payment' , buyProduct);

router.post('/', createProduct);

router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);



module.exports = router;
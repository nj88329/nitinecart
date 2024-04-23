const express = require('express');
const router = express.Router();

const { getContacts ,
     createContact , 
     updateContact , 
     getContact , 
     deleteContact ,
     deleteAllContacts
    } = require("../controllers/contactController");

const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);
router.route('/').get(getContacts).post(createContact).delete(deleteAllContacts);

router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);



module.exports = router;
//@desc get all contact
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = asyncHandler(async( req, res )=>{
     try {
      console.log('reqid' , req.user);
      const contacts=await Contact.find({ user_id: req.user.id });
      console.log('con' , contacts)
      res.status(200).json(contacts);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
})

const createContact =  asyncHandler(async(req, res) =>{
    console.log("The body is:", req.body);
    const { name , phone , email } = req.body ;
     if( !name || !email || !phone )
     {
      res.status(400);
      throw new Error("All fields are mandatory.")
     }
     const contact = await Contact.create({
        name,
        email,
        phone,
        user_id : req.user.id
     });
        res.status(201).json({contact});
      console.log('co', contact)
}
)
const updateContact =  asyncHandler(async(req, res) =>{

    const contact = await Contact.findById(req.params.id); 
    if(!contact)
    {
       res.status(404);
       throw new Error(" Contact not found ");
    }
      if(contact.user_id.toString() !== req.user.id )
      {
         res.status(403);
         throw new error("user don't have permission to update other user.")
      }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new : true }
)
    res.status(200).json(updatedContact);
})

const getContact =  asyncHandler(async( req, res )=>{
    const contact = await Contact.findById(req.params.id);
    
     if(!contact)
     {
        res.status(404);
      throw new Error(" Contact not found ");
     }
   res.status(200).json(contact);
})

const deleteContact  =  asyncHandler(async(req, res) =>{
    const contact = await Contact.findById(req.params.id);
    if(!contact)
    {
        res.status(404);
       console.log('not found')
        throw new error("Contact not found");
    }
       await Contact.deleteOne({_id:req.params.id}); 
    res.status(200).json({ message:`Deleted contact : ${req.params.id}`});
});


const deleteAllContacts = asyncHandler(async(req, res)=>{

 try{
    const contactsAll = await Contact.find();
    if(  contactsAll.length  > 0 )
    {
       let contactsToRemove =  await Contact.deleteMany({});
       res.status(201).json(contactsToRemove);
    }
   }
   catch(err){
    console.log('err', err);
   }
})

module.exports = { getContacts , createContact , updateContact , getContact , deleteContact , deleteAllContacts };
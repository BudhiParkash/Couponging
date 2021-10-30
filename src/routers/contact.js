const express = require('express')
const Contact = require('../model/contact')
const router = new express.Router()


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//New Contact
router.post('/v1/contact', async (req,res)=>{
    

    const subData = new Contact(req.body)
    try {      
            await subData.save() 
            return  res.status(201).send(subData)
        
    } catch (error) {
        return res.status(400).send(error)
    }
        
        

})









module.exports = router

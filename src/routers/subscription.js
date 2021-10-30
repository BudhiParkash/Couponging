const express = require('express')
const Subscription = require('../model/subscription')
const router = new express.Router()


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//New Subscription
router.post('/v1/subs', async (req,res)=>{
    

    const subData = new Subscription(req.body)
    try {      
            await subData.save() 
            return  res.status(201).send(subData)
        
    } catch (error) {
        return res.status(400).send(error)
    }
        
        

})









module.exports = router

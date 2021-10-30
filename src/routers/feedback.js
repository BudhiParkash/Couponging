const express = require('express')
const FeedBacks = require('../model/feedback')
const Subscription = require('../model/subscription')
const router = new express.Router()


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//New Feedback
router.post('/v1/feedback', async (req,res)=>{
    

    const fedData = new FeedBacks(req.body)
    try {      
            await fedData.save() 
            return  res.status(201).send(fedData)
        
    } catch (error) {
        return res.status(400).send(error)
    }
        
        

})









module.exports = router

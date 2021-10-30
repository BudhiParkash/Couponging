const express = require('express')
const FeedBacks = require('../model/feedback')
const Logs = require('../model/logs')
const Subscription = require('../model/subscription')
const router = new express.Router()


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//New Feedback
router.post('/v1/logs', async (req,res)=>{
    

    const fedData = new Logs(req.body)
    try {      
            await fedData.save() 
            return  res.status(201).send(fedData)
        
    } catch (error) {
        return res.status(400).send(error)
    }
        
        

})









module.exports = router

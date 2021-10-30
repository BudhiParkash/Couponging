const express = require('express')
const router = new express.Router()
const Counter = require('../model/counter')
const auth = require('../middleware/auth')
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post('/v1/counter',auth ,async (req,res)=>{
    

    const subData = new Counter (req.body)
    try {      
            await subData.save() 
            return  res.status(201).send(subData)
        
    } catch (error) {
        return res.status(400).send(error)
    }
        
        

})









module.exports = router

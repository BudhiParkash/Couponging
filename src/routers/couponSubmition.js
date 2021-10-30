const express = require('express')
const Contact = require('../model/contact')
const CouponSub = require('../model/couponSubmition')
const router = new express.Router()


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//New Coupon Submition
router.post('/v1/submit/coupon', async (req,res)=>{
    
    const data = new CouponSub(req.body)
    try {      
            await data.save() 
            return  res.status(201).send(data)
        
    } catch (error) {
        return res.status(400).send(error)
    }       

})









module.exports = router

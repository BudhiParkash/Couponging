const express = require('express')
const router = new express.Router()
const Counter = require('../model/counter')
const auth = require('../middleware/auth')
const Stores = require('../model/stores')
var mongoose = require('mongoose');
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


router.post('/v1/counter/upgrade',async (req,res)=>{
    
    var id = req.query.idOfStore
    var objectId = mongoose.Types.ObjectId(id);
    var storeData = await Stores.findById(objectId)

    const counterData = await Counter.findOne({})
    try {      

        counterData.counterNumber += storeData.storeAvgValue

        await counterData.save()
            return  res.status(200).send(counterData)
        
    } catch (error) {
        return res.status(400).send(error)
    }       

})


router.get('/v1/counter',async (req,res) => {


    const counterData = await Counter.findOne({},{counterNumber:1,_id:0})

    if(!counterData){
        return res.status(404).send({error:"No counter found"})
    }

    return res.status(200).send(counterData)


})









module.exports = router

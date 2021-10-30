const express = require('express')
const Coupon = require('../model/coupon')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
var moments = require('moment');
var mongoose = require('mongoose');
// date1 = "2021-09-30"
// currentDate = moments().format("YYYY-MM-DD")
// console.log(date1);
// console.log(currentDate);
// console.log(date1  >=  currentDate );

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//CSV Upload for Category
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads/csv/')
    },
    filename:function(req,file,cb){
        cb(null , new Date().toISOString().replace(/:/g, '-') +"-"+ file.originalname)
    }
})
const fileFilter = (req,file,cb) =>{

    if(file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel"){
        cb(null,true)
    }
    else{
        cb(null,false)
        const err = new Error('Only csv format allowed!')
        err.name = 'ExtensionError'
        return cb(err)
    }

}
const upload = multer({
    storage : storage,
    limits:{
        fileSize:1024*1024*100
    },
    fileFilter:fileFilter
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.post('/v1/coupon/uploadCSV',upload.single('csv') ,auth,async(req,res)=>{
    const filePath = req.file.path   
    try {
        const csvFilePath= filePath
        const csv=require('csvtojson')
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            var items = jsonObj;
           Coupon.insertMany(items).then(function(){
            return res.status(200).send("Data Inserted")
        }).catch(function(error){
            return res.status(400).send(error)   
        });})
         
             } catch (error) {
                 res.status(500).send(error)
             }
    
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Create Coupon
router.post('/v1/Coupon',auth,async (req,res)=>{

     const data = new Coupon(req.body)
try {
        await data.save()
        res.status(201).send(data)

    } catch (error) {
        res.status(400).send(error)
    }
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Update likes or dislike of Coupon
router.post('/v1/Coupon/rating',async (req,res)=>{

    var value = req.query.changingValue 
    var status = req.query.status
    var id = req.query.id  
    var objectId = mongoose.Types.ObjectId(id);
     var coupon = await Coupon.findById(objectId)
     if(!coupon){
         return res.status(404).send()
     }

     if(status == "Active"){

        if(value == 1){
            coupon.likes = coupon.likes + 1
            coupon.dislikes = coupon.dislikes - 1
        }
        else{
            coupon.likes = coupon.likes - 1
            coupon.dislikes = coupon.dislikes + 1
        }

     }else{
        if(parseInt(value) == 1){
            coupon.likes = coupon.likes + 1
        }
        else{
            coupon.dislikes = coupon.dislikes + 1
        }}

    try {
        await coupon.save()
        res.status(200).send(coupon)

    } catch (error) {
        res.status(400).send(error)
    }
})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Get Coupond by Store 
router.get('/v1/Coupon/byStore',async(req,res)=>{
   
    if(req.query.storeName){
        storeName = req.query.storeName
        const data = await Coupon.find( { parentStoreName: storeName  })
        if(data.length == 0){
           return res.status(404).send()
        }
        const currentDate = moments().format("YYYY-MM-DD")
        data.forEach(checkStatus)

        function checkStatus(item, index, arr) {
           
           if(item.expiryDate <= currentDate) 
            {
                item._doc.status = "Expired" 
            }
            else{
                item._doc.status = "Active" 
            }
        }
        



        res.status(200).send(data) 
    } else{
        return res.status(400).send()
    }
     
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//Get Coupond by CDTitle
router.get('/v1/Coupon',async(req,res)=>{

if(req.query.cdTitle){
    cdTitle = req.query.cdTitle
    const data = await Coupon.findOne( { cdTitle: cdTitle  })
    if(!data){
       return res.status(404).send()
    }
    res.status(200).send(data) 
}

else{
    return res.status(400).send()
}

 
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//Get Popular Coupon on Home
router.get('/v1/popCoupon/home',async(req,res)=>{
   
    const data = await Coupon.find( {$and:[ {cdType:"coupon"}, {featuredOnHome:true} ]}).sort({ranking:-1}).limit(parseInt(req.query.limit||10))
    if(data.length == 0){
       return res.status(404).send()
    }
    res.status(200).send(data)  
})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//Get Popular Coupon
router.get('/v1/popCoupon',async(req,res)=>{
   
    const data = await Coupon.find({cdType:"coupon"}).sort({ranking:-1}).limit(parseInt(req.query.limit||10))
    if(data.length == 0){
       return res.status(404).send()
    }
    res.status(200).send(data)  
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



//Get Popular Deals
router.get('/v1/popDeal',async(req,res)=>{
   
    const data = await Coupon.find({cdType:"deal"}).sort({ranking:-1}).limit(parseInt(req.query.limit||10))
    if(data.length == 0){
       return res.status(404).send()
    }
    res.status(200).send(data)  
})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get Popular Deals on Home
router.get('/v1/popDeal/home',async(req,res)=>{
   
    const data = await Coupon.find( {$and:[ {cdType:"deal"}, {featuredOnHome:true} ]}).sort({ranking:-1}).limit(parseInt(req.query.limit||10))
    if(data.length == 0){
       return res.status(404).send()
    }
    res.status(200).send(data)  
})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Remove Coupon
router.delete('/v1/coupon/rem',auth, async(req,res) =>{

    try {
        data = await Coupon.find()
        if(data.length == 0){
            return res.status(404).send()
        }

        await Coupon.deleteMany({})
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error)
    }

   


})



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


 
//Delete particuler Coupon
router.delete('/v1/Coupon',auth, async(req,res)=>{
    try {
        if(req.query.adId){
                _id = req.query.adId;
                qData = await Coupon.findById(_id)
        
                if(!qData){
                    return res.status(404).send()
                }
                
                await qData.remove()
                res.status(200).send()
            }
        } catch (e) {
        res.status(500).send()
    }
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Update Coupon
router.patch('/v1/Coupon',async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['like','dislike','usedBY']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))

    if(req.query.adId){
    if(!isValidOperator){
        return res.status(400).send({error : 'Invalid updates'})
    }
        _id = req.query.adId;
        data = await Coupon.findById(_id)

        if(!data){
            return res.status(404).send()
        }

        try {
                updates.forEach((update)=>{
                    data[update] = req.body[update]

        })
         await data.save()
         res.send(data)

    } 
    catch (e) {
        res.status(400).send(e)
    }
    }else{
        res.status(400).send()
    }
})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



//Get Number of coupon
router.get('/v1/ccbystore',async(req,res)=>{
   
    const data = await Coupon.aggregate([{ $group: { "_id":   "$parentStoreName" , "names": { "$addToSet": "$cdTitle" } } } ])

 

    if(data.length == 0){
       return res.status(404).send()
    }


    data.forEach(getCountNumber)

function getCountNumber(item, index, arr) {
  item.noOfcoupon = item.names.length
  delete item.names;
}



    res.status(200).send(data)  
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports = router
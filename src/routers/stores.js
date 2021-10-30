const express = require('express')
const Stores = require('../model/stores')
const auth = require('../middleware/auth')
const multer = require('multer')
const Coupon = require('../model/coupon')
const router = new express.Router()
// const io = require('socket.io-client');
// var socket = io("http://localhost:3001", {transports: ['websocket', 'polling', 'flashsocket']});


// socket.on("connect", () => {
//     //console.log(socket.id); 
//   });
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Create stores
router.post('/v1/stores',auth,async (req,res)=>{

     const data = new Stores(req.body)
try {
        await data.save()
        res.status(201).send(data)

    } catch (error) {
        res.status(400).send(error)
    }
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Get All Stores with coupon number
router.get('/v1/allStores',async(req,res)=>{
   
            const storeData = await Stores.find({}, {storeTitle:1, _id:1 ,parentCatName:1,storeLogoUrl:1,storeFriendlyName:1})
            if(storeData.length == 0){
               return res.status(404).send()
            }
            const data = await Coupon.aggregate([{ $group: { "_id":   "$parentStoreName" , "names": { "$addToSet": "$_id" } } } ])


            data.forEach(getCountNumber)
            function getCountNumber(item, index, arr) {
                item.noOfcoupon = item.names.length
                delete item.names;
              }

            if(data.length == 0){
               
            }else{
                for(index=0;index< storeData.length;index++){
                    var fire = 0
                    for(copIndex =0 ;copIndex < data.length;copIndex++){
                        
                        if(storeData[index].storeFriendlyName == data[copIndex]._id){
                            storeData[index]._doc.couponCount = data[copIndex].noOfcoupon
                                fire = 1
                        }
                        
    
                    }
                    if(fire == 0){
                        storeData[index]._doc.couponCount =0
                    }
    
                }
            }
              res.status(200).send(storeData)  
    })   
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get Store by Category    
router.get('/v1/stores',async(req,res)=>{
   
        if(req.query.catName){
            catName = req.query.catName
            const storeData = await Stores.find({ parentCatName: catName})
            if(storeData.length == 0){
               return res.status(404).send()
            }
            
            for(index =0 ;index < storeData.length ; index++){
                const countNo = await Coupon.find({parentStoreName:storeData[index].storeFriendlyName}).count()
                storeData[index]._doc.couponCount = countNo
                
            }  

            res.status(200).send(storeData) 
        }
        
       else if(req.query.stName){
            stName = req.query.stName
            const storeData = await Stores.findOne( { storeFriendlyName: stName },)
            if(!storeData){
               return res.status(404).send()
            }
            res.status(200).send(storeData) 
        }
       else if(req.query.stTitle){
        stTitle = req.query.stTitle
            const storeData = await Stores.findOne( { storeTitle: stTitle },)
            if(!storeData){
               return res.status(404).send()
            }
            res.status(200).send(storeData) 
        }
        
        else{
            return res.status(400).send()
        }
         
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get Store by Name
// router.get('/v1/storename',async(req,res)=>{
   
//     if(req.query.stName){
//         stName = req.query.stName
//         const storeData = await Stores.findOne( { storeFriendlyName: stName },)
//         if(!storeData){
//            return res.status(404).send()
//         }
//         res.status(200).send(storeData) 
//     }
//    else if(req.query.stTitle){
//     stTitle = req.query.stTitle
//         const storeData = await Stores.findOne( { storeTitle: stTitle },)
//         if(!storeData){
//            return res.status(404).send()
//         }
//         res.status(200).send(storeData) 
//     }
    
    
    
//     else{
//         return res.status(400).send()
//     }
     
// })
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Get Popular Store
router.get('/v1/popstore',async(req,res)=>{
   
    const storeData = await Stores.find().sort({ranking:-1}).limit(parseInt(req.query.limit||10))
    if(storeData.length == 0){
       return res.status(404).send()
    }
    res.status(200).send(storeData)  
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Get Popular Store
router.get('/v1/home/topstore',async(req,res)=>{
   
    const storeData = await Stores.find({featuredAtHome:true}).sort({ranking:-1}).limit(parseInt(req.query.limit||10))
    if(storeData.length == 0){
       return res.status(404).send()
    }

      for(index =0 ;index < storeData.length ; index++){

        const countNo = await Coupon.find({parentStoreName:storeData[index].storeFriendlyName}).count()
        storeData[index]._doc.couponCount = countNo
        }  

  return  res.status(200).send(storeData)  
})



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 
//Delete Store
router.delete('/v1/stores',auth, async(req,res)=>{
    try {
        if(req.query.sid){
                _id = req.query.sid;
                qData = await Stores.findById(_id)
        
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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Delete All Store
router.delete('/v1/store/rem',auth, async(req,res) =>{

            try {
                storeData = await Stores.find()
                if(storeData.length == 0){
                    return res.status(404).send()
                }
    
                await Stores.deleteMany({})
                res.status(200).send()
            } catch (error) {
                res.status(500).send(error)
            }
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Update Category
router.patch('/v1/stores', auth,async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['storeTitle','storeContent','ranking','metaKeywords','metaDiscriptions','storeLogoImg',"storeFriendlyName","url"]
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))

    if(req.query.sid){
    if(!isValidOperator){
        return res.status(400).send({error : 'Invalid updates'})
    }
        _id = req.query.sid;
        storeData = await Stores.findById(_id)

        if(!storeData){
            return res.status(404).send()
        }

        try {
                updates.forEach((update)=>{
                    storeData[update] = req.body[update]

        })
         await storeData.save()
         res.send(storeData)

    } 
    catch (e) {
        res.status(400).send(e)
    }
    }else{
        res.status(400).send()
    }
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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







router.post('/v1/stores/uploadCSV',upload.single('csv') ,auth,async(req,res)=>{
    const filePath = req.file.path   
    try {
        const csvFilePath= filePath
        const csv=require('csvtojson')
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            var items = jsonObj;
           Stores.insertMany(items).then(function(){
            return res.status(200).send("Data Inserted")
        }).catch(function(error){
            return res.status(400).send(error)     
        });})
         
             } catch (error) {
                 res.status(500).send(error)
             }
    
})


// router.post('/v1/postrating',async(req,res) =>{

//     socket.emit('storeRating', { storeName: "wevibe", click: "up" });
//     socket.emit('counterUpdate', { AvgValue: 4.5});
//     socket.emit('logs', { ip: "hi", device: "uername",country: "hi", store: "uername",date: "2021-09-09", value: 12 });

// })

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports = router
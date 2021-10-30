const express = require('express')
const Category = require('../model/category')
const auth = require('../middleware/auth')
const Categories = require('../model/category')
const router = new express.Router()
const multer = require('multer')

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Create Category
router.post('/v1/category',auth,async (req,res)=>{

     const data = new Category(req.body)
try {
        await data.save()
        res.status(201).send(data)

    } catch (error) {
        res.status(400).send(error)
    }
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Get Category
router.get('/v1/category',async(req,res)=>{
   
    if(req.query.catName){
        catName = req.query.catName
        const data = await Category.findOne( { catfriendlyName: catName })
        if(!data){
           return res.status(404).send()
        }
        res.status(200).send(data) 
    }
  else if(req.query.catTitle){
    catTitle = req.query.catTitle
        const data = await Category.findOne( { catTitle: catTitle })
        if(!data){
           return res.status(404).send()
        }
        res.status(200).send(data) 
    }
    
    else{
        const categoryData = await Category.find()
            if(categoryData.length == 0){
               return res.status(404).send()
            }
            res.status(200).send(categoryData)  
    }

            
    })


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 
//Delete Category
router.delete('/v1/category',auth, async(req,res)=>{
    try {
        if(req.query.cid){
                _id = req.query.cid;
                qData = await Category.findById(_id)
        
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

//Update Category
router.patch('/v1/category', auth,async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['catTitle','logoLink','ranking','metaKeywords','metaDiscriptions','catfriendlyName','discription']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))

    if(req.query.cid){
    if(!isValidOperator){
        return res.status(400).send({error : 'Invalid updates'})
    }
        _id = req.query.cid;
        catData = await Category.findById(_id)

        if(!catData){
            return res.status(404).send()
        }

        try {
                updates.forEach((update)=>{
                    catData[update] = req.body[update]

        })
         await catData.save()
         res.send(catData)

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

//Get Popular category by ranking
router.get('/v1/popcategory',async(req,res)=>{
   
    const data = await Category.find().sort({ranking:-1}).limit(parseInt(req.query.limit||10))
    if(data.length == 0){
       return res.status(404).send()
    }
    res.status(200).send(data)  
})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Get Popular category by featured
router.get('/v1/home/popcategory',async(req,res)=>{
   
    const data = await Category.find({featured:true}).sort({ranking:-1}).limit(parseInt(req.query.limit||10))
    if(data.length == 0){
       return res.status(404).send()
    }
    res.status(200).send(data)  
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


router.post('/v1/category/uploadCSV',upload.single('csv') ,auth,async(req,res)=>{
    const filePath = req.file.path   
    try {
        const csvFilePath= filePath
        const csv=require('csvtojson')
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            var items = jsonObj;
           Categories.insertMany(items).then(function(){
            return res.status(200).send("Data Inserted")
        }).catch(function(error){
            return res.status(400).send(error)     
        });})
         
             } catch (error) {
                 res.status(500).send(error)
             }
    
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Remove Coupon
router.delete('/v1/category/rem',auth, async(req,res) =>{

    try {
        data = await Categories.find()
        if(data.length == 0){
            return res.status(404).send()
        }

        await Categories.deleteMany({})
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error)
    }

   


})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


module.exports = router
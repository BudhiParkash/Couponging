const express = require('express')
const FAQ = require('../model/faq')
const router = new express.Router()
const multer = require('multer')
const auth = require('../middleware/auth')


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Post Single FAQ
router.post('/v1/faq',auth ,async (req,res)=>{
    

    const data = new FAQ(req.body)
    try {      
            await data.save() 
            return  res.status(201).send(data)
        
    } catch (error) {
        return res.status(400).send(error)
    }
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Post Multiple FAQ using CSV
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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Upload Csv Faq
router.post('/v1/FAQ/uploadCSV',upload.single('csv') ,auth,async(req,res)=>{
    const filePath = req.file.path   
    try {
        const csvFilePath= filePath
        const csv=require('csvtojson')
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            var items = jsonObj;
           FAQ.insertMany(items).then(function(){
            return res.status(200).send("Data Inserted")
        }).catch(function(error){
            return res.status(400).send(error)     
        });})
         
             } catch (error) {
                 res.status(500).send(error)
             }
    
})



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Get FAQ of stores
router.get('/v1/faq', async(req,res) =>{

    var storeName = req.query.parentStore

    try {
        
        var faqs = await FAQ.find({parentStore:storeName})

        if(faqs.length == 0){
            return res.status(404).send()
        }

        return res.status(200).send(faqs)



    } catch (error) {
        return res.status(400).send(error)
    }



})





module.exports = router

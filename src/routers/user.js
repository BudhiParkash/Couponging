const express = require('express')
const User = require('../model/user')
const Store = require('../model/stores')
const router = new express.Router()
const multer = require('multer')
const auth = require('../middleware/auth')
const Coupon = require('../model/coupon')
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//New User Create
router.post('/v1/users', async (req,res)=>{
    

    const user = new User(req.body)

    try {
        findUser = await User.findOne({"email":user.email})

        if(!findUser){
            await user.save() 
            const token = await user.generateAuthToken()
            findUser = user
            return  res.status(201).send({findUser,token})
        }
        else{
            const token = await findUser.generateAuthToken()
            return  res.status(200).send({findUser,token})
        }
    } catch (error) {
        return res.status(500).send(error)
    }
        
        

})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Image Upload
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads/images/')
    },
    filename:function(req,file,cb){
        cb(null , "ZAActiveStorage_VS/"+ file.originalname)
    }
})
const fileFilter = (req,file,cb) =>{

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'||file.mimetype === 'image/jpg'||file.mimetype === 'image/webp' ||file.mimetype === 'image/svg+xml'){
        cb(null,true)
    }
    else{
        cb(null,false)
        const err = new Error('Only image format allowed!')
        err.name = 'ExtensionError'
        return cb(err)
    }

}
const upload = multer({
    storage : storage,
    limits:{
        fileSize:1024*1024*10
    },
    fileFilter:fileFilter
})
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.post('/v1/uploadpic',upload.array('img') ,auth,async(req,res)=>{
    const picPath = req.files.map(file => file.path.replace(/\\/g, '/'))   
 try {
             return   res.status(201).send(picPath)
         } catch (error) {
             res.status(500).send(error)
         }
})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Search Api
router.get('/v1/search',async(req,res)=>{ 
    var regex = new RegExp(req.query.s.toString().trim(), 'i');

    const stores   = await Store.find({$or:[{storeTitle:regex},{storeFriendlyName:regex}]}).sort({registered: -1})    
     if(stores.length == 0)
     {   return    res.status(404).send() }
     else{
        return    res.status(200).send(stores)
     }


})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//Search Api
router.get('/v1/search/alpha',async(req,res)=>{ 
    

    
        const storeData = await Store.find({storeFriendlyName:{$regex: '^' + req.query.s, $options: 'i'}}).sort({ranking:-1}).limit(parseInt(req.query.limit||10))
        if(storeData.length == 0){
           return res.status(404).send()
        }
    
          for(index =0 ;index < storeData.length ; index++){
    
            const countNo = await Coupon.find({parentStoreName:storeData[index].storeFriendlyName}).count()
            storeData[index]._doc.couponCount = countNo
            }  
    
    
        const stores   = await Store.find({storeFriendlyName:{$regex: '^' + req.query.s, $options: 'i'}}, {_id:0,storeTitle:1,storeFriendlyName:1,parentCatName:1}).sort({ranking: -1})    
         if(stores.length == 0)
         {   return    res.status(404).send() }
         else{
            return    res.status(200).send({stores,storeData})
         }


})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



module.exports = router





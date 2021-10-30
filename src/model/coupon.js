const mongoose = require('mongoose')



const coupon_schema = new mongoose.Schema({
    
    cdTitle:{
        type:String
    },
    cdImageLink:{
        type:String
    },
    ranking:{
        type:Number,
        default:0
    },
    metaKeywords:{
        type:String
    },
    featuredOnHome:{
        type:Boolean
    },
    metaDiscriptions:{
        type:String
    },
    expiryDate:{
        type:String
    },
    parentStoreName:{
        type:String
    },
    description:{
        type:String
    },
    cdType:{
        type:String
    },
    actionUrl:{
        type:String
    },
    coupValue:{
        type:String
    },
    couponSideValue:{
        type:String
    },
    parentCategory:{
        type:String
    },
    submitedBy:{
        type:String
    },
    usedBY:{
        type:Number
    },
    likes:{
        type:Number
    },
    dislikes:{
        type:Number
    }

    
},

{
    timestamps:true
})



const Coupon = mongoose.model('coupon',coupon_schema)



module.exports = Coupon
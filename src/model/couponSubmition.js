const mongoose = require('mongoose')


const coupSubmition = new mongoose.Schema({


    storeName:{
        type:String
    },
    couponValue:{
        type:String
    },
    expiryDate:{
        type:String
    },
    description:{
        type:String
    },
    userEmail:{
        type:String
    }



})


const CouponSub = mongoose.model('couponsub',coupSubmition)


module.exports = CouponSub
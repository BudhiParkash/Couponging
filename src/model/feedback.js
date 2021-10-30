const mongoose = require('mongoose')


const feedBack_schema = new mongoose.Schema({
    
    storeName:{
        type:String
    },
    comment:{
        type:String
    },
    rating:{
        type:Number
    }

    
},

{
    timestamps:true
})




const FeedBacks = mongoose.model('feedback',feedBack_schema)



module.exports = FeedBacks
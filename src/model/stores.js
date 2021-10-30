const mongoose = require('mongoose')


const stores_schema = new mongoose.Schema({
    
    storeTitle:{
        type:String,
        required:true,
        unique:true
    },
    storeFriendlyName:{
        type:String
    },
    ranking:{
        type:Number,
        default:0
    },
    storeLogoUrl:{
        type:String
    },
    parentCatName:{
        type:String
    },
    featuredAtHome:{
        type:Boolean
    },
    storeUrl:{
        type:String
    },
    storeAvgValue:{
        type:Number
    },
    storeContent:{
        type:String
    },
    metaKeywords:{
        type:String
    },
    metaDiscriptions:{
        type:String
    },
    rating:{
        type:Number
    }

    
},

{
    timestamps:true
})




const Stores = mongoose.model('store',stores_schema)



module.exports = Stores
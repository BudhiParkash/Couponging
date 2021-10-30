const mongoose = require('mongoose')
const Stores = require('./stores')


const category_schema = new mongoose.Schema({
    
    catTitle:{
        type:String,
        required:true
    },
    catfriendlyName:{
        type:String,
        required:true
    },
    logoUrl:{
        type:String
    },
    ranking:{
        type:Number,
        default:0
    },
    featured:{
        type:Boolean
    },
    metaKeywords:{
        type:String
    },
    metaDiscriptions:{
        type:String
    },
    description:{
        type:String
    }
    
},

{
    timestamps:true
})




const Categories = mongoose.model('categories',category_schema)



module.exports = Categories
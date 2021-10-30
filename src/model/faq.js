const mongoose = require('mongoose')




const faq_schema = new mongoose.Schema({
   
    parentStore:{
        type:String
    },
    question:{
        type:String
    },
    ans:{
        type:String
    }

    
},{
    timestamps:true
})













const FAQ = mongoose.model('faq',faq_schema)



module.exports = FAQ
 

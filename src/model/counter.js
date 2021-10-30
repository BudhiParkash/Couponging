const mongoose = require('mongoose')
const validator = require('validator')




const counter_schema = new mongoose.Schema({
   
    counterNumber:{
        type:Number
    }
    
},{
    timestamps:true
})













const Counter = mongoose.model('counter',counter_schema)



module.exports = Counter
 

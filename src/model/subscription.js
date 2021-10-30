const mongoose = require('mongoose')
const validator = require('validator')




const subscription_schema = new mongoose.Schema({
   
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){

                throw new Error('Enter a valid email')
            }
        },
        required:true
    }
    
},{
    timestamps:true
})













const Subscription = mongoose.model('subscription',subscription_schema)



module.exports = Subscription
 

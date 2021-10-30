const mongoose = require('mongoose')
const validator = require('validator')




const contact_schema = new mongoose.Schema({
   
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){

                throw new Error('Enter a valid email')
            }
        },
        required:true
    },
    phoneNumber:{
        type:String
    },
    name:{
        type:String
    },
    msg:{
        type:String
    }

    
},{
    timestamps:true
})













const Contact = mongoose.model('contact',contact_schema)



module.exports = Contact
 

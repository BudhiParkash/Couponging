const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const user_schema = new mongoose.Schema({
   
    phoneNum:{
        type:Number
       
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){

                throw new Error('Enter a valid email')
            }
        },
        required:true,
        unique:true
    },
    user_name:{
        type: String
    },
     tokens:[{
            token:{
                type:String,
                required:true
            }
        }]

    
},{
    timestamps:true
})



user_schema.methods.toJSON = function () {
    
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

user_schema.statics.findByCredential = async (email,password) =>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to find')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw  new Error('Unable to login')
    }
 return user

}

user_schema.statics.findByCredentialPhone = async (contact,password) =>{
    const user = await User.findOne({contact})

    if(!user){
        throw new Error('Unable to find')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw  new Error('Unable to login')
    }

    return user

}




user_schema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'ljd392440dknkfnhii@#($###)')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}




user_schema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){

        user.password = await bcrypt.hash(user.password,8)

    }
     next()
})








const User = mongoose.model('User',user_schema)



module.exports = User
 

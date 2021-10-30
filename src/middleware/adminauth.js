const jwt = require('jsonwebtoken')
const User = require('../model/user')



const adminauth =  async (req,res,next)=>{
   
    try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token,'ljd392440dknkfnhii@#($###)')
            const user = await User.findOne({_id:decoded._id,'tokens.token': token})

            if(!user){
                throw new Error('Please Authenticate')
            }
            if(user.email != 'superAdmin@deevpdivemedia.in'){
                throw new Error('Please Authenticate')
            }
            req.token = token
            req.user = user
            next()
    } catch (e) {
        res.status(401).send({error:'Please Authenticate'})
    }


  
    
}

module.exports = adminauth
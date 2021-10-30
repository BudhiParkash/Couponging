const mongoose = require('mongoose')



const log_schema = new mongoose.Schema({


    ip:{
        type:String
    },
    device:{
        type:String
    },
    country:{
        type:String
    },
    store:{
        type:String
    },
    date:{
        type:Date
    },
    value:{
        type:Number
    }









})




const Logs = mongoose.model('logs',log_schema)



module.exports = Logs
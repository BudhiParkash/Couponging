const mongoose = require('mongoose')

mongoose.connect(process.env.MONOGO_DB_URL || "mongodb://127.0.0.1:27017/coupongini",{
    useUnifiedTopology:true,
    useNewUrlParser: true 
})

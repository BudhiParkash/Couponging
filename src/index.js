const express = require('express')
require('./db/mongoose')
const path = require('path')
const cors = require('cors')
// const http = require('http').Server(express);
// const io = require('socket.io')(http);
//socket.io
//socket.io-client


const userRouter = require('./routers/user')
const categoryRouter = require('./routers/category')
const storesRouter = require('./routers/stores')
const subsRouter = require('./routers/subscription')
const couponRouter = require('./routers/coupon')
const contactRouter = require('./routers/contact')
const counterRouter = require('./routers/counter')
const logsRouter = require('./routers/logs')
const feedBackRouter = require('./routers/feedback')
const couponSubRouter = require('./routers/couponSubmition')
const faqRouter = require('./routers/faq')
const adminRouter = require('./routers/admin');
// const Logs = require('./model/logs');
// const Stores = require('./model/stores');
// const Counter = require('./model/counter');
const app = express()
const port = process.env.PORT || 3000
//const port2 = process.env.PORT || 3001


app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use(userRouter)
app.use(categoryRouter)
app.use(storesRouter)
app.use(couponRouter)
app.use(couponSubRouter)
app.use(counterRouter)
app.use(subsRouter)
app.use(feedBackRouter)
app.use(faqRouter)
app.use(logsRouter)
app.use(contactRouter)
app.use('/admin',adminRouter)







app.listen(port,()=>{

    console.log('Your server working on port ' + port);
    
})

// io.on('connection', (socket) => {
//     socket.on('storeRating', value => {

//          async  function updateStore() {
//             storedata = await Stores.findOne({storeFriendlyName:value.storeName})
//             storedata.rating = (storedata.rating + 1)
//            await storedata.save()
//            } 

//         updateStore()


//     });


//     socket.on('counterUpdate', value => {

//         async  function updateCounter() {
//            counter = await Counter.findOne({})
//            counter.counterNumber = (counter.counterNumber + value.AvgValue)
//           await counter.save()
//           } 

//           updateCounter()


//    });


//     socket.on('logs', value => {
//         const data = new Logs(value)
//         try {
//            data.save()
//         } catch (error) {
//             console.log("Error in logs sockets");
//         }
//       });

//    });

// http.listen(port2, () => {
//     console.log(`Socket.IO server running at http://localhost:${port2}/`);
//   });
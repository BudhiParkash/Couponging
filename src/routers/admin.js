const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose = require('mongoose')

const Category = mongoose.model("categories")
const Contract = mongoose.model("contact")
const Counter = mongoose.model("counter")

const Coupon = mongoose.model("coupon")
const CouponSub = mongoose.model("couponsub")
const FAQ = mongoose.model("faq")

const FeedBack = mongoose.model("feedback")
const Logs = mongoose.model("logs")
const Store = mongoose.model("store")

const Subscription = mongoose.model("subscription")
const User = mongoose.model("User")

const giveAdminPermissions = ({currentAdmin}) => {
    return currentAdmin.role === "super-admin"
}


AdminBro.registerAdapter(AdminBroMongoose)
const adminBro = new AdminBro({
  resources: [{
    resource : Category,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : Contract,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : Counter,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : Coupon,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : CouponSub,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : FAQ,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : FeedBack,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : Logs,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : Store,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : Subscription,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
},
{
    resource : User,
    options :{
        actions : { edit : {isAccessible : giveAdminPermissions},
                    delete : {isAccessible : giveAdminPermissions},
                    new : {isAccessible : giveAdminPermissions} }
    },
}],
  rootPath: '/admin',
  branding: {
    logo: "https://lh3.googleusercontent.com/proxy/OQTP4K4-Ouf3jNK6KfJL4yCy03mans21_cXjOwFvLEn9O2tveqUvG3MYGOR4v0po7ciYNujaqjqV3r0a_HwNJ8lcfcG-xf8SCp1D",
    companyName: 'DeepDive',
    softwareBrothers: false  
  },
})

const SUPERADMIN = {
    email : 'admin@inventivekey.com',
    password: 'aDmin@&12kiopjsk3@@mls',
    role:"super-admin" 
}

const Viewer = {
    email : 'viewer@inventivekey.com',
    password: 'aDmin@&19h&&2b$$7sSk3@@mls',
    role:"viewer" 
}


const router = AdminBroExpress.buildAuthenticatedRouter(adminBro,{
    cookieName: 'adminkicookielelo',
    cookiePassword:'Mere_nameSahil_h@@&_cookies_koi_hack_niREga&*bhank',
    authenticate : async(email ,password) =>{

        if(email === SUPERADMIN.email && password === SUPERADMIN.password){
            return SUPERADMIN
        }
        else if(email === Viewer.email && password === Viewer.password){
            return Viewer
        }
        return null
    }
})

module.exports = router
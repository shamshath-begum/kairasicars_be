const mongoose=require('mongoose')
// const validator=require('validator')
const CustomerSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    // email:{type:String,required:true ,
    // validate:(value)=>validator.isEmail(value)
    // },
monthlyIncome:{type:String,required:true},
    adharNumber:{type:Number,required:true},
    mobileNumber:{type:Number,required:true},
    alternativeNumber:{type:Number,required:true},
    landMark:{type:String,required:true},
    position:{type:String,required:true},
    customerID:{type:Number,required:true},
    // residentialAddress:{type:String,required:true} ,
    officeAddress:{type:String,required:true},
    reference:{type:String,required:true},
   profession:{type:String,required:true},
    imgpath:{type:String,required:true},
    // documents:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false})


const CustomerModel=mongoose.model('customer',CustomerSchema)
module.exports={CustomerModel}



        
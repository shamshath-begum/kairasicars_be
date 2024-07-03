const mongoose=require('mongoose')

const EMISchema=new mongoose.Schema({
    name:{type:String,required:true},
    customerID:{type:Number,required:true},
    loanAmount:{type:Number,required:true},
    actualDueDate:{type:Date,required:true},
    paidDate:{type:Date,required:true},
    paidAmount:{type:Number,required:true},
    actualEMIAmount:{type:Number,required:true},
    status:{type:String,required:true},
    capital:{type:Number},
    defaultAmount:{type:Number},
    interestAmount:{type:Number},
    modeOfPayment:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false})


const emiModel=mongoose.model('emi',EMISchema)
module.exports={emiModel}


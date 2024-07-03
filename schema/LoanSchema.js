const mongoose=require('mongoose')

const LoanSchema=new mongoose.Schema({
    name:{type:String,required:true},
    customerID:{type:Number,required:true},
    loanAmount:{type:Number,required:true},
    rateOfInterest:{type:Number,required:true},
    months:{type:Number,required:true},
    endingDate:{type:Date,required:true},
    startingDate:{type:Date,required:true},
    emiAmount:{type:Number},
    InterestAmount:{type:Number},
    TotalAmount:{type:Number},
    Capital:{type:Number},
    // customers:[{ type: mongoose.Schema.Types.ObjectId, ref: "customer" }] ,
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false})


const loanModel=mongoose.model('loan',LoanSchema)
module.exports={loanModel}


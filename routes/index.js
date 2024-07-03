var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const { dbUrl } = require("../config/dbConfig");
const { AdminModel } = require('../schema/adminSchema');
const { CustomerModel } = require('../schema/CustomerSchema');
const moment=require("moment")
const {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  upload,
  roleSalesRep,roleAdmin, roleStudent
} = require("../config/auth");
const jwt = require("jsonwebtoken");
const { loanModel } = require('../schema/LoanSchema');
const { emiModel } = require('../schema/EMISchema');



mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// signup and upload the image
router.post("/signup",upload.single("image"), async (req, res) => {

  try {
    const{name,email,password,cpassword}=req.body
    console.log(req.body)
    console.log(name)
    if(!name || !email || !password || !cpassword || name === "" || email === "" || password === "" || cpassword === ""){
      res.status(401).send({
        message:"All the fields are required"
      })
    }
  
    const {filename}=req.file
    console.log("filename",filename)
  
    let admin = await AdminModel.findOne({ email: req.body.email });
    if (!admin) {
      req.body.password = await hashPassword(req.body.password);
      req.body.cpassword = await hashPassword(req.body.cpassword);
      let doc = new AdminModel({name:req.body.name,email:req.body.email,password:req.body.password,cpassword:req.body.cpassword,imgpath:req.file.filename});
      console.log(doc)
      await doc.save();
      res.status(201).send({
        message: "Admin Created successfully",
      });
    } else {
      res.status(400).send({ message: "Admin already registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

// login and token creation
router.post("/login", async (req, res) => {
  try {
    console.log(req.body)
    let admin = await AdminModel.findOne({ email: req.body.email });
    console.log(admin);
    if (admin) {
      if (await hashCompare(req.body.password, admin.password)) {
        let token = createToken({id:admin._id});
        console.log(token);

        res
          .status(200)
          .send({ meassage: "Admin Login Successful", token,admin});
        
        
      } else {
        res.status(400).send({ message: "Invalid credentials" });
      }
    } else {
      res.status(402).send({ message: "Email doesnot exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
});



router.post("/customer-registration",upload.single("image"),async(req,res)=>{
  console.log("first")
  console.log("Request body:", req.body);
//  const{filename}=req.file
  if (!req.file) {
    return res.status(400).send({
      message: "Image file is required"
    });
  }

  
  // const{filename}=req.file
  // console.log("fileName:",filename)
  let doc = new CustomerModel({
    name:req.body.name,
    email:req.body.email,
    adharNumber:req.body.adharNumber,
    monthlyIncome:req.body.monthlyIncome, 
    mobileNumber:req.body.mobileNumber,
    alternativeNumber:req.body.alternativeNumber,
    reference:req.body.reference, 
    officeAddress:req.body.officeAddress,
    imgpath: req.file.path,
    position:req.body.position,
    customerID:req.body.customerID,
    // documents:req.file.documents,
    profession:req.body.profession,
    landMark:req.body.landMark,
// residentialAddress:req.body.residentialAddress
    });
  
      console.log(doc)
      await doc.save();
      res.status(201).send({
        message: "Customer Created successfully",
        doc
      });
})

router.get("/customer-details",async(req,res)=>{
  try {
    let customers=await CustomerModel.find()
    res.status(201).send({
      message:"Customer Details",
      customers
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.put("/customer-edit/:id",async(req,res)=>{

  try {
    let data = await CustomerModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).send({
      message: "Customer Updated Successfully",
      lead: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server error",
      error,
    });
  }
})

router.get("/customer-edited/:id",async(req,res)=>{
  const { id } = req.params;

  try {
      const customer = await CustomerModel.findOne({ _id: id });
      res.status(200).send({
        message:"Customer Detail",
        customer
      })
  } catch (error) {
      res.status(401).send({
        message:"Internal Server Error",
        error
      })
  }
})

router.get("/customer-view/:id",async(req,res)=>{
  const { id } = req.params;
  console.log(id)

  try {
      const customer = await CustomerModel.findOne({ _id: id });
      console.log(customer)
      res.status(200).send({
        message:"Customer Detail",
        customer
      })
  } catch (error) {
      res.status(401).send({
        message:"Internal Server Error",
        error
      })
  }
})

router.delete("/delete/:id",async(req,res)=>{
  try {
    let {id}=req.params;
let data=await CustomerModel.findByIdAndDelete({_id:id})
console.log(data)
res.status(200).send({
  message:"customer deleted successfully"
})
  } catch (error) {
    console.log(error)
    res.status(401).send({
      message:"Internal Server error",
      error,
    })
  }
})

router.post("/loan-registration",async(req,res)=>{
  
  const{name,customerID,loanAmount,rateOfInterest,months}=req.body
  console.log(req.body)
  let interestAmount=loanAmount*(rateOfInterest/100)
  console.log(interestAmount)
  let totalInterest=interestAmount*months
  console.log(totalInterest)
  let totalAmount=totalInterest + +loanAmount
  console.log(totalAmount)
  const EMI=Math.ceil(totalAmount/months)
  console.log(EMI)
  const Capital=EMI-interestAmount
  console.log(Capital)

let doc=new loanModel({InterestAmount:interestAmount,TotalAmount:totalAmount,emiAmount:EMI,name:req.body.name,customerID:req.body.customerID,loanAmount:req.body.loanAmount,rateOfInterest:req.body.rateOfInterest,months:req.body.months,endingDate:req.body.endingDate,startingDate:req.body.startingDate,Capital:Capital})
console.log(doc)
await doc.save()
res.status(201).send({
  message:"Loan Created",
 
doc
})
})

router.get("/loan-details",async(req,res)=>{
  try {
    let loanDetails=await loanModel.find()
    res.status(201).send({
      message:"Customer Details",
      loanDetails,
    
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.get("/loan-details/:customerID",async(req,res)=>{
  console.log("first")
  try {
    const {customerID}=req.params
    console.log(customerID)
    console.log(typeof customerID)

    if(!customerID || isNaN(Number(customerID))){
      return res.status(400).send(({
        error:"Invalid CustomerID"
      }))
    }
    // if(typeof customerID!=="string"){
    //   customerID=String(customerID)
    // }

    console.log(Number(customerID))
    let singleLoanDetails=await loanModel.findOne({customerID:Number(customerID)})
    if(!singleLoanDetails){
      res.status(400).send({
        message:"Loan Details Not Found"
      })
    }
    res.status(201).send({
      message:"Single Loan Details",
      singleLoanDetails,
    
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.post("/emi-details",async(req,res)=>{
  try {
    const{paidDate,loanAmount,capital,interestAmount,name,modeOfPayment,status,paidAmount,actualDueDate,actualEMIAmount,customerID}=req.body
    console.log("original paid date",paidDate)
  console.log(req.body)

  let formattedDate = moment(paidDate, 'DD-MM-YYYY')
console.log("formatted date:",formattedDate)

let dateDay = parseInt(formattedDate.format('DD'), 10);
    console.log('Day of the Date:', dateDay); // Debug: Check extracted day
  // Format the date to get the day
 



let defaultAmount = 0;

  if(25 > dateDay >= 20){
    let actualEMIAmountNum=parseFloat(actualEMIAmount)
    console.log(actualEMIAmountNum)
  
  defaultAmount=actualEMIAmountNum*(0.5/100)
  console.log(defaultAmount)
  }
  if(dateDay >=25){
    defaultAmount=actualEMIAmount*(0.75/100)
    console.log(defaultAmount)
  }
  let doc=new emiModel({paidDate: new Date(formattedDate),capital,interestAmount,loanAmount,name,modeOfPayment,status,paidAmount,actualDueDate,actualEMIAmount,customerID,defaultAmount:defaultAmount})
console.log(doc)
await doc.save()
res.status(201).send({
  message:"EMI Created",
doc
})

  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal Server Error", error });
  }
  
})

router.get("/emi-single-customer-view/:customerID",async(req,res)=>{
  try {
    let customerstr=req.params.customerID
    let customerID = parseInt(customerstr, 10);
    console.log(customerID)
    // const customerID=req.params.customerID
console.log(customerID)
    if(typeof customerID!=="string"){
      customerID=String(customerID)
    }
    console.log("customerID",customerID)
    let SingleCustomerEMIDetails=await emiModel.find({customerID:customerID})
    console.log(SingleCustomerEMIDetails)
    res.status(201).send({
      message:"Single Customer EMI Details",
      SingleCustomerEMIDetails
    })
  } catch (error) {
    console.log(error)
  }
})



router.get("/emi-multiple",async(req,res)=>{
  try {
    let emiDetails=await emiModel.find()
    res.status(201).send({
      message:"EMI Details",
      emiDetails,
    
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.get("/getByName",async(req,res)=>{
  console.log(req.query)
  let keyword=req.query.search ? {

  name:{$regex:req.query.search,$options:"i"}

  }
  :{};
  
const customer=await CustomerModel.find(keyword)
res.status(200).send(customer)
})

router.get("/capital",async(req,res)=>{
  try {
    const {fromDate,toDate}=req.query
    console.log(fromDate,toDate)
const capital=await emiModel.find({
  paidDate:{
    $gte: new Date(fromDate),
      $lte: new Date(toDate) 
  }
})
console.log(capital)
res.status(200).send({message:"Capital Created Successfully",
  capital
})



  } catch (error) {
    console.log(error)
  }
})



module.exports = router;

const jwt=require('jsonwebtoken')
require('dotenv').config();
const user=require('./models/User');


exports.auth= async (req,res,next)=>{
    try{
        const token=req.body.token||req.cookies.token||(req.header('Authorization').replace("Bearer ",""));

        if(!token){
            return res.status(401).json({
                success:false,
                message:"No token found",
            })
        }

        try{
            const decode= await jwt.verify(token,process.env.JWT_SECRET)
            console.log("Printing the decoded output of JWT_SECRET",decode)
            req.user=decode
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Problem in verifying token and unable to give decoded output of the token"
            })
        }
        next();
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Unable to authenticate using the token"
        })
    }
};


exports.isStudent=async(req,res,next)=>{
    try{
        const userDetails=await user.find({email:req.user.email})
        if(userDetails.accountType!=='Student'){
            return res.status(401).json({
                success:false,
                message:"Not a Student"
            })
        }
        next();
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Not able to authenticate whether a student or not"
        })
    }
}

exports.isInstructor=async(req,res,next)=>{
    try{
        const userDetails=await user.find({email:req.user.email})
        if(userDetails.accountType!=='Instructor'){
            return res.status(401).json({
                success:false,
                message:"Not a Instructor"
            })
        }
        next();
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Not able to authenticate whether an Instructor or not"
        })
    }
}

exports.isAdmin=async(req,res,next)=>{
    try{
        const userDetails=await user.find({email:req.user.email})
        if(userDetails.accountType!=='Admin'){
            return res.status(401).json({
                success:false,
                message:"Not an Admin"
            })
        }
        next();
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Not able to authenticate whether an Admin or not"
        })
    }
}


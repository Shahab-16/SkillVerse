const bycrypt=require('bcrypt');
const user=require('./models/User');
const OTP=require('./models/OTP');
const otpGenerator=require('otp-generator');
const jwt=require('jsonwebtoken');




exports.signUp=async(req,res,next)=>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            phoneNumber,
            accountType,
            otp
        }=req.body

        if(!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber || !accountType){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match"
            })
        }

        const userExist=await user.findOne({email});

        if(userExist){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        const recentopt=await OTP.findOne({email}).sort({createdAtL:-1}).limit(1);
        console.log(recentopt);
        if(recentopt.length==0){
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }

        if(recentopt.otp!=otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        const additionalDetails=await Profile.create({
            gender:null,
            address:null,
            about:null,
            dob:null,
            dreamJob:null,
            dreamCompany:null,
        })

        const hashedPassword=await bycrypt.hash(password,10);
        console.log(hashedPassword);

        const userData=await user.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password:hashedPassword,
            accountType:accountType,
            additionalDetails:additionalDetails._id,
            image:"",
        })

        return res.status(200).json({
            success:true,
            message:"User created successfully",
            userData
        })

    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Unable to signup"
        })
    }
}


exports.login=async(req,res,next)=>{
    try{
        const {
            email,
            password
        }=req.body;
    
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
    
        const userData=await user.findOne({email}).populate("additionalDetails");
    
        if(!userData){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
    
        if(await bycrypt.compare(password,userData.password)){
            const payLoad={
                id:userData._id,
                email:userData.email,
                accountType:userData.accountType
            }
            const token =jwt.sign({email:userData.email},process.env.JWT_SECRET,{expiresIn:"2h"});
            userData.token=token;
            userData.password=undefined;
            await userData.save();

        }
    
        return res.status(200).json({
            success:true,
            message:"User logged in successfully",
            token
        })
    
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Unable to login"
        })
    }
}

exports.sendOtp=async(req,res,next)=>{
    try{
        const {email}=req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email is required"
            })
        }

        const userData=await user.findOne({email});

        if(userData){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        var otp=otpGenerator.generate(6,{digits:true,lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
        
        var result=await OTP.findOne({otp});

        while(result){
            otp=otpGenerator.generate(6,{digits:true,lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
            result=await OTP.findOne({otp});
        }

        console.log(otp);
        console.log(result);

        const otpPayload={
            email,
            otp
        }

        const otpData=await OTP.create(otpPayload);

        return res.status(200).json({    
            success:true,
            message:"OTP sent successfully",
            otpData
        })

    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Unable to generate OTP"
        })
    }
}

exports.changePassword=async(req,res)=>{
    try{
        const userDetails=await user.findByid(req.user.id);

        const {oldPassword,newPassword}=req.body;

        const isPasswordMatch=await bycrypt.compare(oldPassword,userDetails.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Old password is incorrect",
            })
        }

        const hashedPassword=await bycrypt.hash(newPassword,10);

        const updatedDetails=await user.findOneAndUpdate(
            req.user.id,
            {
                password:hashedPassword
            },
            {new:true}
        )

        try{
            const emailResponse=await mailSender(
                updatedDetails.email,
                "Password changed successfully",
                "Your password has been changed successfully"
            )
        }
        catch(err){
            return res.status(400).json({
                success:false,
                message:"Unable to send changed password email",
            })
        }
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Unable to change password",
        })
    }
}
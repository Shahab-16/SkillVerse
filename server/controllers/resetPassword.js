const user=require('./models/User');
const crypto=require('crypto');
const bcrypt=require('bcrypt');
const mailSender=require('../utils/mailsender');


exports.resetPasswordToken=async(req,res)=>{
    try{
        const {email}=req.body;

        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email is required"
            })
        }
        const userExist=await user.findone({email});
        if(!userExist){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        const token=crypto.randomBytes(32).toString('hex');

        const updatedDetails=await user.findOneAndUpdate(
            {email:email},
            {
                token:token,
                expireTime:Date.now()+5*60*60*1000
            },
            {new:true}
        );
        console.log("UpdatedDetails : ",updatedDetails);

        const url=`http://localhost:3000/resetPassword/${token}`;

        await mailSender(
            email,
            "Reset Password",
            `Click on the link to reset your password ${url}`
        )

        return res.status(200).json({
            success:true,
            message:"Password reset link sent to your email"
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error while sending password reset link"
        })
    }
}


exports.resetPassword=async(req,res)=>{
    try{
        const {password,confirmPassword,token}=req.body;

        if(!password || !confirmPassword || !token){
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

        updatedPassword=await bcrypt.hash(password,10);

        const updatedDetails=await user.findOneAndUpdate(
            {token:token},
            {
                password:updatedPassword
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error while resetting password"
        })
    }
}
const express=require('express');
const router=express.Router();


const {signUp,login,sendOtp,changePassword}=require('../controllers/Auth');
const {resetPasswordToken,resetPassword}=require('../controllers/resetPassword');
const {auth,isAdmin,isStudent,isInstructor}=require('../middleware/auth');


router.post('/signup',signUp);
router.post('/login',login);
router.post('/sendOtp',sendOtp);
router.post('/changePassword',auth,changePassword);



router.post('/resetPasswordToken',resetPasswordToken);
router.post('/resetPassword',resetPassword);

module.exports=router;


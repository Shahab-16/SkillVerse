const express=require('express');
const router=express.Router();
const {auth}=require('../middleware/auth');


const {createProfile,updateProfile,deleteProfile,showProfile} = require('../controllers/profile');

router.post('/create-profile',auth,createProfile);
router.put('/update-profile',auth,updateProfile);
router.delete('/delete-profile',auth,deleteProfile);
router.get('/show-profile',auth,showProfile);

module.exports=router;

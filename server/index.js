const express=require('express');
//const connectDB=require('./config/database');
require('dotenv').config();


const app=express();

//TODO
//connectDB();
app.get('/',(req,res)=>{
    res.send('hello world');
})

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})




const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {authenticator}=require('../middlewares/authenticator');
const {authorize}=require('../middlewares/authorize');
const { UserModel } = require('../models/UserModel');
const {TokenModel}=require('../models/TokenModel');   // For Blacklisting
const userRouter=express.Router();

// Signup Route
userRouter.post('/signup',async(req,res)=>{
    const {username,email,password,role}=req.body;
    try {
        const isPresent=await UserModel.find({email});
        if(isPresent.length){
            res.status(406).send('User already registered!!');
        }
        else{
            bcrypt.hash(password,4,async(err,encrypted)=>{
                if(encrypted){
                    const user= new UserModel({username,email,password:encrypted,role});
                    await user.save();
                    res.status(200).send('User registerd successfully.');
                }
                else{
                    console.log(err);
                }
            })
        }
    }catch (error) {
        res.status(500).send('something went wrong');
    }
})

// Login Route
userRouter.post('/login',async(req,res)=>{
    const{email,password}=req.body;
    try {
        const user=await UserModel.findOne({email});
        if(user){
            const hashPass=user.password;
            bcrypt.compare(password,hashPass,(err,result)=>{
                if(result){
                    const token=jwt.sign({id:user._id},process.env.nkey,{expiresIn : 60});
                    const refresh=jwt.sign({id:user._id},process.env.rkey,{expiresIn : 300});
                    res.status(200).json({"msg": "Sign in successfull..","token":token,"refreshToken":refresh});
                }
                else{
                    res.status(400).send("Wrong Password entered!!");
                }
            })   
        }
        else{
            res.status(400).send("Wrong E-mail entered!!");
        }
    }catch (error) {
        res.status(500).send('something went wrong');
    }
})

// Logout Route
userRouter.get('/logout',async(req,res)=>{
    const accessToken=req.headers.authorization;
    try {
        await TokenModel.updateOne({},{$push:{tokens:accessToken}});
        const blacklistedTokens=await TokenModel.find();
        res.status(200).send("Logged out successfully..");
    } catch (error) {
        res.status(500).send('Something went wrong!!');
    }
})

// Product Route
userRouter.get('/products',authenticator,async(req,res)=>{
    try{
        res.status(200).send('SOME PRODUCTS HERE');
    }catch(error) {
        res.status(500).send('Something went wrong!!');
    }
})

// Add Products(sellers only)
userRouter.post('/addproducts',authenticator,authorize(["seller"]),(req,res)=>{
    res.status(200).send('SOME PRODUCTS');
})

// Delete products(sellers only)
userRouter.delete('/deleteproducts/:id',authenticator,authorize(["seller"]),(req,res)=>{
    res.status(200).send('SOME PRODUCTS');
})
module.exports={userRouter}
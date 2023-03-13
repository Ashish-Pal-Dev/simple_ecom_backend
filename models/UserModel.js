const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,   
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        required: true,            
        default: "customer",          //  default role if not passed
        enum: ["seller", "customer"]   // only these roles are permitted
    }
},{versionKey:false});

const UserModel=mongoose.model("users",userSchema);

module.exports={UserModel}
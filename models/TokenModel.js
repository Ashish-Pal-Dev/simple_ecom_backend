const mongoose=require('mongoose');

const tokenSchema= new mongoose.Schema({
    tokens: [{type:String}]
},{versionKey:false});

const TokenModel= mongoose.model('token',tokenSchema);

module.exports={TokenModel}
const express=require('express');
const {connection}=require('./config/db');
const { userRouter } = require('./routes/user.route');

const app=express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('WELCOME TO HOME PAGE');
})

app.use('/users',userRouter);

app.listen(process.env.port||4500,async()=>{
    try {
        await connection;
        console.log('connected to DB');
    } catch (error) {
        console.log(error);
    }
    console.log(`Running at Port: ${process.env.port||4500}`);
})

const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const login=async(req,res)=>{
    try{
        if (!req.body.email ||!req.body.password)
        {
            return res.status(400).send({message:"Please fill all the required fields (email, password)"});
        }
        const existingUser=await User.findOne({email:req.body.email});    
        const isPasswordValid=existingUser && await bcrypt.compare(req.body.password, existingUser.password);
        if(!isPasswordValid){
            return res.status(401).send({message:"Invalid email or password"});
        }
        const token=jwt.sign({userId:existingUser._id}, process.env.JWT_SECRET, {expiresIn:"1h"});
        res.status(200).json({
            message:"Login successful",
            data:existingUser,
            token:token
        });
    }catch(error){
        res.status(500).json({message:"Failed to login", error:error.message});
    }
};

module.exports = { login };

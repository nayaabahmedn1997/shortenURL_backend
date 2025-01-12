const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendActivationEmail, forgotPasswordEmail } = require("../utils/nodeMailer");
//Register controller

const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body;
        const existingUser = await userModel.findOne({email});
        
        //Check if user exists
        if(existingUser)
        {
            return res.status(400).json({
                "message":"user already exists"
            });
        }
        const salt = await bcrypt.genSalt(7);
        const hashedPassword = await bcrypt.hash(password, salt);
        const activationToken = await jwt.sign({email}, process.env.ACTIVATION_SECRET_KEY, {expiresIn:"14d"});

        sendActivationEmail(email, activationToken);


        const newUser = new userModel({
            name,
            email,
            password:hashedPassword,
            activationToken
        });
        await newUser.save();

        return res.status(201).json({
            "message":"User registered successfully..Please activate your account"
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
           
            error: error.message
        })
    }
}

const activateUser = async (req, res)=>{
    try {
        const {email} = req.body;
        const user =await userModel.findOne({email});
        if(!user)
        {
            return res.status(400).json({
                "message":"User doesn't exists"
            })
        }

        if(user && user.isUserActivated)
        {
            return res.status(400).json({
                "message":"User is already activated"
            });
        }

        user.isUserActivated = true;
        user.activatedAt =  Date.now();
        user.activationToken = "";
        await user.save();

        return res.status(200).json({
            "message":"User account activated"
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.status(404).json({
                "message":"User not found!"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect)
        {
            return  res.status(400).json({
                "message":"Invalid credentials"
            })
        }

        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn:"1d"});

        return res.status(200).json({
            "message":"User logged in successfully",
            token
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const getUserData = async (req, res)=>{
    try {
        const {id} = req.body;
        const user = await userModel.findById(id);
        if(!user)
        {
            return res.status(404).json({
                "message":"User not found"
            });
        }
        res.status(200).json({
           message:"User data successfully fetched",
           userData:{ 
            ...user._doc,
            password:""
           }
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const forgotUserPassword = async (req, res) =>{
    try {
        const {email} =req.body;
        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.status(200).json({
                "message":"User doesn't exist"
            })
        }
        const resetToken = await jwt.sign({email}, process.env.RESET_SECRET_KEY, {expiresIn:"1d"});

        forgotPasswordEmail(email, resetToken);

        return res.status(200).json({
            "message":"Mail sent successfully",
            resetToken
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const resetPassword = async(req, res)=>{
    try {
        const {resetToken} = req.params;
        const {password} = req.body;
        const {email} = await jwt.verify(resetToken, process.env.RESET_SECRET_KEY);
        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.status(404).json({
                "message":"User not found"
            })
        }
        const salt = await bcrypt.genSalt(7);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetToken = "";
        await user.save();
        return res.status(200).json({
            "message":"User password reset was successful"
        })
    
        
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}
module.exports = {registerUser, activateUser, loginUser, getUserData, forgotUserPassword, resetPassword}
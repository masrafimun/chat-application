// import bcrypt from "bcryptjs"
import { json } from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import transporter from "../confiq/nodeMailer.js"
import verifyUserModel from "../models/verifyModel.js"
import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'

//send otp for sign up
export const sendToken = async (req, res) => {
    const { email, name, password,userName } = req.body;

    try {

        if(!name || !email || !password || !userName){
            return res.json({
                success: false,
                message: "Plese provite all the informations",
            })
        }

        // Checking if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists",
            });
        }

        // Checking if username  is already exist or not
        const userNa = await userModel.findOne({ userName });
        if (userNa) {
            return res.json({
                success: false,
                message: "This username is already taken",
            });
        }

        // Checking if OTP is already sent
        const userr = await verifyUserModel.findOne({ email });
        if (userr) {
            return res.json({
                success: false,
                message: "OTP already sent. Use it or reset OTP.",
            });
        }

        // Generating OTP
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Setting OTP expiration (3 minutes from now)
        const date = Date.now() + 3 * 60 * 1000;

        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Sending OTP to user
        try {
            await transporter.sendMail({
                from: `"Masrafi" <${process.env.SENDER_EMAIL}>`,
                to: email,
                subject: "Welcome to ChatApp",
                text: "Welcome to ChatApp",
                html: `Your one-time OTP is <strong>${verificationCode}</strong>. Verify your account with this code.`, // HTML body
            });
        } catch (err) {
            return res.json({
                success: false,
                message: "Couldn't send OTP",
            });
        }

        // Creating new user with OTP
        const user = new verifyUserModel({
            name,
            email,
            userName,
            password: hashedPassword,
            verifyotp: verificationCode,
            verifyOtpExpireAt: date,
        });

        await user.save();

        return res.json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.json({
            success: false,
            message: err.message,
        });
    }
};


// verifying otp  for signup
export  const veritfyOtp = async (req,res) =>{
    const {email,otp} = req.body
   
    try{
        if(!otp){
            return res.json({
                success : false,
                message : "Please enter the Otp"
            })
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists",
            });
        }

        //finding the user
        const user = await verifyUserModel.findOne({ email})
        
        //checking if the exists or not
        if(!user){
            return res.json({
                success : false,
                message : "Please verify the otp"
            })
        }

        //checking if the otp is correct or not
        if(user.verifyotp === '' || user.verifyotp != otp){
            return res.json({
             success : false,
             message : "Invalid OTP"
            })
         }
        
        //  checking if the otp has expiredate
        if(user.verifyOtpExpireAt <Date.now()){
            return res.json({
                success : false,
                message : "OTP is expired"
            })
        }

     

        //creating user in the user database
        const newUser = new userModel({
            name : user.name,
            email : user.email,
            password : user.password,
            userName : user.userName
        })
        
        await newUser.save()
  
        
        //creating web token
        const token = jwt.sign({id : newUser._id},process.env.JWT_SECRET,{expiresIn : '7d'})
                
        res.cookie('token',token, {
            httpOnly : true,
            secure : true,
            sameSite : 'None',
            maxAge : 30 * 24 * 60 * 60 * 1000,
            path: "/",
        })

        await user.deleteOne();

        return res.json({
            success : true,
            message : "Account verified successfully",
            userId : newUser._id
        })
        
    }
    catch(err){
        res.json({
            success : false,
            message :err.message
        })
    }

    
}

//reset otp for verify
export const resetVerifyOtp = async (req,res) =>{
    const {email} = req.body

    if(!email){
        return res.json({
            success : false,
            message : "Please enter the email"
        })
    }


    try{
        // Checking if the user already exists in user database
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.json({
            success: false,
            message: "User already exists",
        });
    }

    // Checking if the user already exits in the verify database
    const userr = await verifyUserModel.findOne({ email });
    if (!userr) {
        return res.json({
            success: false,
            message: "Plase try again",
        });
    }
    else{
        // Generating OTP
         const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Setting OTP expiration (3 minutes from now)
         const date = Date.now() + 3 * 60 * 1000;

        // Sending OTP to user
        await transporter.sendMail({
            from: `"Masrafi" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "Welcome to ChatApp",
            text: "Welcome to ChatApp",
            html: `Your one-time OTP is <strong>${verificationCode}</strong>. Verify your account with this code.`, // HTML body
        });
    


        //update
        await verifyUserModel.findOneAndUpdate({ email },{
            verifyotp: verificationCode,
            verifyOtpExpireAt: date,
        },{ new: true, upsert: false });


        return res.json({
            success: true,
            message: "OTP sent successfully",
        });
     }}
    catch(err){
       res.json({
           success : false,
           message : err.message
        })
    }
}

//end










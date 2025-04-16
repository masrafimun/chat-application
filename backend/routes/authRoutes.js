import express from 'express'
import { sendToken, veritfyOtp,resetVerifyOtp } from '../controllers/authController.js'

//creating user router
const authRouter = express.Router()

authRouter.post('/otp',sendToken)
authRouter.post('/verify',veritfyOtp)
authRouter.post('/reset',resetVerifyOtp)


export default authRouter
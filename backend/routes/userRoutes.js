import express from 'express'
import { acceptReq, addBio, addProfilepic, allUser, cancelSendReq, checkStatus, deleteAccount, deleteConversation, friendList, friendReqList, getInfo, isAuthenticated, loadMessage, login, logout, rejectReq, removeFriend, resetOtp, sendReq, sendText, sendToken, veritfyOtp } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'


//creating user router
const userRouter = express.Router()
userRouter.post('/login',login)
userRouter.post('/otp',sendToken)
userRouter.post('/reset',resetOtp)
userRouter.post('/changePassword',veritfyOtp)
userRouter.get('/auth',userAuth,isAuthenticated)
userRouter.post('/logout',logout)
userRouter.post('/addProfilePic',userAuth,addProfilepic)
userRouter.post('/addBio',userAuth,addBio)
userRouter.get('/getInfo',userAuth,getInfo)
userRouter.get('/getInfoALL',userAuth,allUser)
userRouter.post('/sendReq',sendReq)
userRouter.post('/acceptReq',acceptReq)
userRouter.post('/cancelSendReq',cancelSendReq)
userRouter.post('/rejectReq',rejectReq)
userRouter.post('/removeFriend',removeFriend)
userRouter.post('/checkStatus',checkStatus)
userRouter.get('/friendList',userAuth,friendList)
userRouter.get('/friendReqList',userAuth,friendReqList)
userRouter.post('/sendText',userAuth,sendText)
userRouter.post('/loadMessage',userAuth,loadMessage)
userRouter.post('/deleteConversation',userAuth,deleteConversation)
userRouter.post('/deleteAccount',userAuth,deleteAccount)




export default userRouter


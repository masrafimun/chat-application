import validator from 'validator'
import {v2 as cloudinary} from 'cloudinary'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import transporter from "../confiq/nodeMailer.js"


//importing models
import userModel from "../models/userModel.js"
import messageModel from '../models/messageModel.js'



//creating login endpoint
export const login = async (req,res) => {
    const {email,password} = req.body

    if(!email || !password){
        return res.json({
            success :false,
            message : "Email and password are required"
        })
    }

    try{
        const user = await userModel.findOne({email})

        //checking if user is exists or not
        if(!user){
            return res.json({
                success : false ,
                message : "User doesn't exist"
            })
        }

        //cheking password
        const isMatch = await bcrypt.compare(password , user.password)

        if(!isMatch){
            return res.json({
                success : false,
                message : 'Invalid password'
        })
        }

        //creating web token
        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : '7d'})
    
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/",
        });

        



        //login successful
        return res.json({
            success : true,
            message : "Login successful",
            userId : user._id
        })

    }
    catch(err){
        return res.json({
            success: false,
            message : err.message
        })
    }
}


//sending otp
export const sendToken = async (req, res) => {
    const { email } = req.body;

    try {

        if(!email){
            return res.json({
                success: false,
                message: "Plese enter your Email",
            })
        }

        // Checking if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exists",
            });
        }

       
        if (user.verifyotp) {
            return res.json({
                success: false,
                message: "OTP has already sent. Use it or reset OTP.",
            });
        }

        // Generating OTP
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Setting OTP expiration (3 minutes from now)
        const date = Date.now() + 3 * 60 * 1000;


        // Sending OTP to user
      
        await transporter.sendMail({
            from: `"Masrafi" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "verify your otp",
            text: "verify your otp",
            html: `Your one-time OTP is <strong>${verificationCode}</strong> to change your password`,
        });
        

        user.verifyotp =verificationCode
        user.verifyOtpExpireAt = date

       
        await user.save();

        return res.json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
        });
    }
};


//reset otp 
export const resetOtp = async (req,res) =>{
    const {email} = req.body

    if(!email){
        return res.json({
            success : false,
            message : "Please enter the email"
        })
    }


    try{

    // Checking if the user already exists in user database
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.json({
            success: false,
            message: "User doesn't exist",
        });
    }


    // Generating OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Setting OTP expiration (3 minutes from now)
    const date = Date.now() + 3 * 60 * 1000;

    // Sending OTP to user
    await transporter.sendMail({
        from: `"Masrafi" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Verify your otp",
        text: "Verify your otp",
        html: `Your one-time OTP is <strong>${verificationCode}</strong> to change your password`, // HTML body
    });
    
    //update
    await userModel.findOneAndUpdate({ email },{
        verifyotp: verificationCode,
        verifyOtpExpireAt: date,
    },{ new: true, upsert: false });


    return res.json({
        success: true,
        message: "OTP sent successfully",
    });
    }
    catch(err){
       res.json({
           success : false,
           message : err.message
        })
    }
}


//verify otp and change your password
export  const veritfyOtp = async (req,res) =>{
    const {email,otp,password} = req.body
   
    try{
        if(!email || !otp || !password){
            return res.json({
                success : false,
                message : "Please provide all the informations"
            })
        }
        //finding the user
        const user = await userModel.findOne({ email})
        
        //checking if the exists or not
        if(!user){
            return res.json({
                success : false,
                message : "User not found"
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

     
        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        //updating user in the user database
        user.verifyotp = "";
        user.verifyOtpExpireAt = 0;
        user.password = hashedPassword;

        await user.save();
        
  
        
        //creating web token
        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : '7d'})
                
        res.cookie('token',token, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 30 * 24 * 60 * 60 * 1000,
            path: "/",
        })


        return res.json({
            success : true,
            message : "Password has changed successfully"
        })
        
    }
    catch(err){
        res.json({
            success : false,
            message :err.message
        })
    }

    
}

//creating endpoint for logout
export const logout = async (req,res) =>{
    try{
        res.clearCookie('token',{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: "/",
        })

        return res.json({
            success : true,
            message : "Logged out successfully"
        })
    }
    catch(err){
        return res.json({
            success: false,
            message : err.message
        })
    }
}


//check if it s authicaed or not
export const isAuthenticated = async (req, res) => {
  try{
    return res.json({
        success: true,
        message : "authorized",
        userId : req.body.userId
    })
  }
  catch(err){
    return res.json({
        success: false,
        message: "Invalid or expired token",
    });
  }
};

// adding profile picture
export const addProfilepic = async (req,res) => {

    try{
          //getting user id
       const userId = req.body.userId
     

    
        //getting the image
       const profilePic =  req.files.profileImage

       //images url
       let result = await cloudinary.uploader.upload(profilePic.tempFilePath, { resource_type: 'image' });

       // Get the secure URL of the uploaded profile picture
       const profilePicUrl = result.secure_url

         //getting user information
         await userModel.findByIdAndUpdate(userId,{
            profilePhoto:  profilePicUrl
         })
 
       return res.json({
        success : true ,
        message : "Profile picture uploaded",
         profilePicc : profilePicUrl
       })
    }
    catch(err){
        return res.json({
            success : false,
            message : "Couldn't upload profile picture"
        })
    }
    
}


//bio
export const addBio =async (req,res) =>{
    try{

        const bio = req.body.bioDup
        


        //getting user id
       const userId = req.body.userId
       if(!userId){
        return res.json({
            success : false,
            message : "Couldnt find user if"
        })
       }

       //getting user information
       await userModel.findByIdAndUpdate(userId,{bio})

       return res.json({
        success: true,
        message : "Bio upadated",bio
       })
 
    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}


//getting single user information

export const getInfo =async (req,res) =>{
    try{
       //getting user id
       const userId = req.body.userId

       if(!userId){
        return res.json({
            success : false,
            message : "Couldnt find user if"
        })
       }
     
    const userDetails = await userModel.findById(userId)
    
 

    if(!userDetails){
        return res.json({
            success : false,
            message : "Couldnt find user details"
        })
    }

    return res.json({
        success : true,
        message : "got user details",
        userdetails : userDetails
    })




    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}


//find all user 
export const allUser = async (req,res) =>{
    try{
    const userDetails = await userModel.find({})
    if(userDetails){
        return res.json({
            success : true ,
            message : "Found all the details",
            userDetails
        })
    }

    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}


//sending friend request
export const sendReq = async (req,res) =>{
    try{
        //geting ids 
        const { senderId,receiverId} = req.body;

        //getting receiver
        const receiver = await userModel.findById(receiverId)

        if(!receiver.friendRequests.includes(senderId)){
            receiver.friendRequests.push(senderId)
            await receiver.save()
        }
        return res.json({
            success : true,
            message : "Friend request sent successfully"
        })
    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}

//sending friend request
export const cancelSendReq = async (req,res) =>{
    try{
        //geting ids 
        const { senderId,receiverId} = req.body;

        //getting receiver
        const receiver = await userModel.findById(receiverId)

        if(!receiver.friendRequests.includes(senderId)){
            return res.json({
                success : false,
                message : "User not found"
            })
        }
 
        if(receiver){
            receiver.friendRequests = receiver.friendRequests.filter(id=> id != senderId )
            await receiver.save()
        }
        return res.json({
            success : true,
            message : "Friend request is canceled "
        })
    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}

//acceppting friend request
export const acceptReq = async (req,res) =>{
    try{
        //geting ids 
        const { senderId,receiverId} = req.body;

        //getting receiver
        const receiver = await userModel.findById(receiverId)
        const userExists = receiver.friends.filter(id=> id === senderId )

        if(!userExists){
            return res.json({
                success : false,
                message : "User is already friend"
            })
        }
        

        receiver.friends.push(senderId)
        receiver.friendRequests = receiver.friendRequests.filter(id=> id != senderId )
        await receiver.save()

        //findig sender 
        const sender = await userModel.findById(senderId)
        sender.friendRequests = sender.friendRequests.filter(id=> id != receiverId )
        sender.friends.push(receiverId)
        await sender.save()

        return res.json({
            success :true,
            message : "Friend requested acceepted.."
        })
        
    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}


//reject friend request 
export const rejectReq = async (req,res) =>{
    try{
         //geting ids 
         const { senderId,receiverId} = req.body;

         //getting receiver
         const receiver = await userModel.findById(receiverId)
         receiver.friendRequests = receiver.friendRequests.filter(id=> id != senderId )
         await receiver.save()

         return res.json({
            success : true,
            message : "Friend requested rejected"
         })
    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}


//removing friends 
export const removeFriend = async (req,res) =>{
    try{
        //geting ids 
        const { senderId,receiverId} = req.body;

        //getting receiver
        const receiver = await userModel.findById(receiverId)
        receiver.friends = receiver.friends.filter(id=> id != senderId )
        await receiver.save()

        //getting sender
        const sender = await userModel.findById(senderId)
        sender.friends = sender.friends.filter(id=> id != receiverId )
        await sender.save()

        return res.json({
           success : true,
           message : "Unfriended successfully"
        })
    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}

//status
export const checkStatus = async (req,res) =>{
    try{
        //geting ids 
        const { senderId,receiverId} = req.body;
        //getting receiver
        const receiver = await userModel.findById(receiverId)

        if(receiver.friends.includes(senderId)){
            return res.json({
                success : true,
                message : "Friends"
            })
        }
        if(receiver.friendRequests.includes(senderId)){
            return res.json({
                success : true,
                message : "Requested"
            })
        }

        return res.json({
            success : true,
            message : "Add"
        })
    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}


//getting friend list
export const friendList = async (req,res) =>{
    try{
        //getting user id
        const userId = req.body.userId 
        const user = await userModel.findById(userId)
                   .populate('friends', 'name email userName profilePhoto bio')
                   .select('friends') 
        if(!user){
            return res.json({
                success : false,
                message : "User not found"
            })
        }

        const friends = user.friends
        return res.json({
            success : true,
            message :"Found friends",
            friends
        })

    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}

//getting friend request list
export const friendReqList = async (req,res) =>{
    try{
        //getting user id
        const userId = req.body.userId 
        const user = await userModel.findById(userId)
                  .populate('friendRequests', 'name email userName profilePhoto bio')
                  .select('friendRequests') 
        if(!user){
            return res.json({
                success : false,
                message : "User not found"
            })
        }

        const ReqList = user.friendRequests
        return res.json({
            success : true,
            message :"Found friends",
            ReqList
        })

    }
    catch(err){
        return res.json({
            success : false,
            message : err.message
        })
    }
}



// Send a message
export const sendText =  async (req, res) => {
    const { text, sender, receiver } = req.body;

    let imageUrl = '';


    if (req.files && req.files.imageT) {
        const imagee = req.files.imageT;
        let result = await cloudinary.uploader.upload(imagee.tempFilePath, { resource_type: 'image' });
        imageUrl = result.secure_url;
      }
  

    try {

        
      const newMessage = await messageModel.create({ sender, receiver, content:text ,image:imageUrl});
      res.status(201).json({
        success:true,
        message:"message send successfully",
        newMessage 
    });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

//getting messages
export const loadMessage =  async (req, res) => {
    const { sender, receiver } = req.body;
    try {
      const messages = await messageModel.find({
        $or: [
          { sender: sender, receiver: receiver },
          { sender: receiver, receiver: sender }
        ]
      }).sort({ timestamp: 1 });


  
      res.json({
        success : true,
        messages
      });
    } 
    catch (error) {
      res.json({ 
        success: false,
        message : "Failed to fetch messages"
    })
  }
}
  
//delete conversation
export const deleteConversation = async(req,res) =>{
    try{
        const sender = req.body.userId
        const receiver = req.body.receiver

        //deleting message
        const result = await messageModel.deleteMany({
            $or: [
              { sender: sender, receiver: receiver },
              { sender: receiver, receiver: sender }
            ]
          });
        res.json({
            success: true,
            message : "conversation deleted"
        })
    }
    catch(err){
        res.json({
            success : false,
            message :"Sorry! couldn't delete the account"
        })
    }
}


//delete account
export const deleteAccount = async (req,res) =>{
    try{
        const user = req.body.userId
        console.log(user)
        await userModel.findOneAndDelete({ _id: user });

        res.clearCookie('token',{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: "/",
        })
        res.json({
            success: true,
            message : "account deleted"
        })
    }
    catch(err){
        res.json({
            success : false,
            message :"Sorry! couldn't delete the account"
        })
    }
}





















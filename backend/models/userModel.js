import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true,
        unique : true
    },

    verifyotp : {
        type : String,
        default : ''
    },

    verifyOtpExpireAt : {
        type : Number,
        default : 0
    },

    isAccountVerified : {
        type : Boolean,
        default : false
    },

    status: { 
        type: String, 
        enum: ['online', 'offline'], 
        default: 'offline' 
    },
    profilePhoto: { 
        type: String, 
        default: null 
    },
    userName :{
        type : String,
        default : ''
   },
   bio: { 
        type: String, 
        default: "" 
    },
    
    friends: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],

    friendRequests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]

})
const userModel = mongoose.model('User', userSchema);

export default userModel;
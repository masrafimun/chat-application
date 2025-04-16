import mongoose from "mongoose";

const verifySchema = new mongoose.Schema({
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

    resetOtp : {
        type : String,
        default : ''
    },

    resetOtpExpireAt : {
        type : String,
        default : 0
    }
    ,
    userName :{
        type : String,
        default : ''
    },

})
const verifyUserModel = mongoose.model('verifyUser', verifySchema);

export default verifyUserModel;
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
   },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
  },
  image: { 
    type: String 
  },
  timestamp: { 
    type: Date, 
    default: Date.now }
});


const messageModel = mongoose.model('message', messageSchema);
  
export default messageModel;
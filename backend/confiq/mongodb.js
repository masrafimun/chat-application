import mongoose  from "mongoose";

const connectDB = async () =>{

    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/chat-application`)        
         .then(() => console.log('Database connected successfully'))
    } 
    catch(err){
         console.log(err)
    }
}

export default connectDB
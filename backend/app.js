//external import
import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from "cookie-parser"
import http from 'http'
import { Server } from 'socket.io'
import fileUpload from "express-fileupload";

//internal import
import connectDB from './confiq/mongodb.js'
import connectCloudinary from './confiq/clodinary.js'

//importing router
import userRouter from './routes/userRoutes.js'
import authRouter from './routes/authRoutes.js'



//app confiq
const app = express()


app.use(cors({
    origin: "https://chat-frontend-x2cr.onrender.com", 
    credentials: true,
}));



//creating http server
const server = http.createServer(app)
//connecting socket.io to cors
const io = new Server(server, {
    cors: {
        origin: "https://chat-frontend-x2cr.onrender.com", 
        credentials: true
    }
});


const port = process.env.PORT || 9000   //port
connectDB()     // mongodb connection
connectCloudinary() //cloudinary connection


// Middleware setup
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));




app.get("/", (req, res) => {
  res.send("Backend is up");
});


//online user list
let onlineUsers = [];


//socket io connection
io.on("connection",(socket) =>{
    
    socket.on('user_Id',(userId)=>{
        if (!onlineUsers.includes(userId)) {
            socket.userId = userId;
            onlineUsers.push(userId);
        }
        io.emit("get-Users", onlineUsers);
    })

   
   //creating room
    socket.on("join",(userId) =>{
        socket.join(userId)
    })
     //to send message
     socket.on("send-message",(data)=>{
        socket.to(data.receiver).emit("received_message",data)
    })

    //disconnect
    socket.on('disconnect',()=>{
        onlineUsers = onlineUsers.filter(id => id !=socket.userId);
        io.emit("get-Users", onlineUsers);
    })

   

    //disconnected
    socket.on("disconnect",() =>{
        // console.log("user disconnected ",socket.id)
    })
})
   //receiving message and responding to everyone

// socket.on("send_message",(data) =>{
//     socket.broadcast.emit("receive_message",data)
// })



//api endpoints
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)



server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

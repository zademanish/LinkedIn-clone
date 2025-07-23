import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import http from "http";
import { Server } from "socket.io";
import notificationRouter from "./routes/notification.routes.js";

dotenv.config();
let app= express();
let server = http.createServer(app)

export const io = new Server(server,{
    cors:({
    origin:"https://linkedin-clone-frontend-o9b7.onrender.com",
    credentials:true
})
})


app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(cors({
    origin:"https://linkedin-clone-frontend-o9b7.onrender.com",
    credentials:true
}))

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/connection",connectionRouter)
app.use("/api/notification",notificationRouter)

export const userSocketMap = new Map()

io.on("connection",(socket)=>{
    
    socket.on("register",(userId)=>{
        userSocketMap.set(userId,socket.id)
        console.log(userSocketMap)
    })
    socket.on("disconnect",(socket)=>{
       
        
    })
})

server.listen(PORT,()=>{
    connectDb();
    console.log(`Server is listining ${PORT}`)
})
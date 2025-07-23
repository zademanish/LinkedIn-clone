import mongoose from "mongoose";


const connectDb = async()=>{
    try {
        mongoose.connect(process.env.MONGO_URI).then(()=>{
             console.log("Mongo db is connected");
        })
        
    } catch (error) {
        console.log("DB-Error: ",error)
    }
}

export default connectDb;

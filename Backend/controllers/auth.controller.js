import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const singUp = async(req,res)=>{
    try {
        let {firstName, lastName, userName, email,password} = req.body;
        let existEmail = await User.findOne({email});

        if(existEmail){
            return res.status(400).json({
                message:"Email already exist !"
            })
        }
        if(password.length < 8){
            return res.status(402).json({message:"password must be 8 character"})
        }

         let existUsername = await User.findOne({userName})

        if(existUsername){
            return res.status(400).json({
                message:"Username already exist !"
            })
        }

        let hashedPassword = await bcrypt.hash(password,10)
        const user= await User.create({
            firstName,
            lastName,
            userName,
            email,
            password:hashedPassword,
        });

        let token=await generateToken(user._id)
       
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        })

        return res.status(201).json(
        user)

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Sign up error"})
    }
}

export const logIn = async(req,res)=>{
    try {
        let {email,password} = req.body;
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"user does not exist !"
            })
        }
       const isMatch = await bcrypt.compare(password,user.password)

       if(!isMatch){
        return res.status(400).json({message:"Incorrect Password"});
       }

        let token=await generateToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENVIRONMENT ==="production"
        })

        return res.status(200).json(
        user)

    } catch (error) {
        console.log(error);
          return res.status(500).json({message:"login error"})
    }
}

export const logOut = async(req,res)=>{
 try {
    res.clearCookie("token")
    return res.status(200).json({message:"Logout successfully"});
 } catch (error) {
    console.log(error);
         return res.status(500).json({message:"login error"})
    }
}
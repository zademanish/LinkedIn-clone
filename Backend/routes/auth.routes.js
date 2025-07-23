import express from "express";
import { logIn, logOut, singUp } from "../controllers/auth.controller.js";


let authRouter = express.Router();

authRouter.post("/signup",singUp);
authRouter.post("/login",logIn);
authRouter.get("/logout",logOut);



export default authRouter;

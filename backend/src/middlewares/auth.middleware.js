import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate =  (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(400).json({error:"Token is needed"})
        }
        const token = authHeader.split(' ')[1];
        const decoded =  jwt.verify(token,process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        console.log("user decode",req.user)
        next();

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const authorizationRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        console.log("allowed",allowedRoles)
        if(!req.user || !allowedRoles.includes(req.user.role)){
            console.log('role',req.user.role)
            return res.status(403).send({
                message:"You are not authorized user"
            })
        }
        next()
    }
}
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (user)=>{
    return jwt.sign(
        {id:user.id, role:user.role},process.env.JWT_ACCESS_SECRET,{expiresIn:'1h'}
    )
}


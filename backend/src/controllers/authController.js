
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import supabase from "../config/supabaseClient.js";
import { generateAccessToken } from "../utils/jwt.utils.js";

dotenv.config();

export const signup = async (req,res)=>{
    try {
        const {name,email,password,balance} = req.body;

        if(!name||!email || !password ){
            return res.status(400).json({error:"name,email and password is required field"})
        }

        const {data:existing,error:newError} = await supabase
        .from('users').select().eq('email',email)

        if(newError){
            return res.status(400).json({error:newError.message})
        }
        if(existing && existing.length > 0){
            return res.status(409).json({error:"Email is already existed"})
        }

        const hashedPass = await bcrypt.hash(password,10);
        const InputData = { name,email,password:hashedPass}
        if (balance !== undefined){
            InputData.balance = balance;
        }
        const {data,error} =await supabase
        .from('users').insert([InputData]).select('name,email,balance')

        if(error){
            return res.status(400).json({error:error.message})
        }

        res.status(200).json({
            message:"User registered successfully!",
            data
        })


    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const login = async (req,res)=>{
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"email and password is required"})
        }

        const {data,error} = await supabase
        .from('users').select().eq('email',email).maybeSingle()

        if(error){
            return res.status(400).json({error:error.message})
        }

        if(!data ){
            return res.status(404).json({error:"User not found"})
        }


        const isMatch = await bcrypt.compare(password,data.password);
        if(!isMatch){
            return res.status(401).json({error:"Invalid credentials"})
        }
       
        const accessToken = generateAccessToken(data);

        res.status(200).json({
            message:"login successfully!",
            id:data.id,
            accessToken:accessToken,
            
        })

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


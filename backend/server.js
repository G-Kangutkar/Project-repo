import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
 import useAuth from "./src/routes/auth.route.js";
import useAcc from './src/routes/account.route.js';

const app = express();

const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(cors());
 app.use('/api/auth',useAuth);
app.use('/api/account',useAcc)


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
});
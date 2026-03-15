import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
 import useAuth from "./src/routes/auth.route.js";
// import useTodo from './src/routes/todos.route.js';

const app = express();

const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(cors());
 app.use('/api',useAuth);
// app.use('/todos',useTodo)


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
});
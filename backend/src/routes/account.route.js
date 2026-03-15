import express from "express";
import { getAccountStatement, getBalance, sendMoney } from "../controllers/accountController.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/balance',authenticate,getBalance);
router.post('/transfer',authenticate, sendMoney)
router.get('/statement',authenticate, getAccountStatement)



export default router;
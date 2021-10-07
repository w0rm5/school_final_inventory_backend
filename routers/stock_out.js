import express from "express";
import { createStockOut } from "../controllers/stock_out.js";
import { checkIfAdmin } from "../middlewares/auth.js";
import { stockOutTypes } from "../utils/enum.js";

const checkStockOutType = (req, res, next) => {
    if(req.body.stock_in.type != stockOutTypes.SALE){
        checkIfAdmin(req, res, next)
    }else{
        next()
    }
}

const router = express.Router()

router.post("/insert", checkStockOutType, createStockOut)

export default router
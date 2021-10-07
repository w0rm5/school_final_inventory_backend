import express from "express";
import { getStockIn, createStockIn, getAllStockIns } from "../controllers/stock_in.js";
import { checkIfAdmin } from "../middlewares/auth.js";
import { stockInTypes } from "../utils/enum.js";

const checkStockInType = (req, res, next) => {
    if(req.body.stock_in.type != stockInTypes.RETURN){
        checkIfAdmin(req, res, next)
    }else{
        next()
    }
}

const router = express.Router()

router.get("/:id",checkIfAdmin, getStockIn)
router.post("/", checkIfAdmin, getAllStockIns)
router.post("/insert", checkStockInType, createStockIn)

export default router
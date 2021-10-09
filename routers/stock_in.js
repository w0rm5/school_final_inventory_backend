import express from "express";
import { getStockIn, createStockIn, getAllStockIns } from "../controllers/stock_in.js";
import { checkIfAdmin } from "../middlewares/auth.js";
import { stockInTypes } from "../utils/enum.js";

const checkStockInType = (req, res, next) => {
    let { stock_in, stock_in_items } = req.body
    if(!stock_in || !stock_in.type || !Array.isArray(stock_in_items) || !stock_in_items.length){
        res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Invalid stock in data" });
        return
    } else if(stock_in.type != stockInTypes.RETURN) {
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
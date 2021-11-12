import express from "express";
import { createStockOut, getAllStockOuts, getStockOutById, getStockOutByTransNum } from "../controllers/stock_out.js";
import { checkIfAdmin } from "../middlewares/auth.js";
import { stockOutTypes, meta } from "../utils/enum.js";

const checkStockOutType = (req, res, next) => {
    let { stock_out, stock_out_items } = req.body
    if(!stock_out || !stock_out.type || !Array.isArray(stock_out_items) || !stock_out_items.length){
        res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Invalid stock out data" });
        return
    } else if(stock_out.type != stockOutTypes.SALE){
        checkIfAdmin(req, res, next)
    }else{
        next()
    }
}

const router = express.Router()

router.get("/:id", checkIfAdmin, getStockOutById)
router.get("/trans-no/:trans_no", getStockOutByTransNum)
router.post("/", checkIfAdmin, getAllStockOuts)
router.post("/insert", checkStockOutType, createStockOut)

export default router
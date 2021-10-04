import express from "express";
import { getStockIn, createStockIn } from "../controllers/stock_in.js";

const router = express.Router()

router.get("/:id", getStockIn)
router.post("/insert", createStockIn)

export default router
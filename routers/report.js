import express from "express";
import { getStockInReports, getStockOutReports } from "../controllers/report.js";

const router = express.Router()

router.post("/stock-in", getStockInReports)
router.post("/stock-out", getStockOutReports)

export default router
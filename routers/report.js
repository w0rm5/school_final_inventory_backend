import express from "express";
import { getStockInReports } from "../controllers/report.js";

const router = express.Router()

router.post("/stock-in", getStockInReports)

export default router
import express from "express";
import { listCategory, upsertCategory } from "../controllers/category.js";

const router = express.Router()

router.get("/", listCategory)
router.post("/upsert", upsertCategory)

export default router
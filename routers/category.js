import express from "express";
import { listCategory, upsertCategory, getCategoryById, deleteCategoryById } from "../controllers/category.js";
import { logRequests } from "../middlewares/logs.js";

const router = express.Router()

router.get("/", logRequests, listCategory)
router.get("/:id", logRequests, getCategoryById)
router.delete("/:id", logRequests, deleteCategoryById)
router.post("/upsert", logRequests, upsertCategory)

export default router
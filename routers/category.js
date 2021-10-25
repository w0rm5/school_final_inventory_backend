import express from "express";
import { listCategory, upsertCategory, getCategoryById, deleteCategoryById, checkCategoryName } from "../controllers/category.js";

const router = express.Router()

router.get("/", listCategory)
router.get("/:id", getCategoryById)
router.get("/check-name/:name", checkCategoryName)
router.delete("/:id", deleteCategoryById)
router.post("/upsert", upsertCategory)

export default router
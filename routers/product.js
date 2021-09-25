import express from "express";
import { listProduct, upsertProduct, deleteProductById, getProductById } from "../controllers/product.js";

const router = express.Router()

router.get("/", listProduct)
router.get("/:id", getProductById)
router.delete("/:id", deleteProductById)
router.post("/upsert", upsertProduct)

export default router
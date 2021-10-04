import express from "express";
import { listProduct, upsertProduct, deleteProductById, getProductById } from "../controllers/product.js";
import { checkIfAdmin } from "../middlewares/auth.js";

const router = express.Router()

router.post("/", listProduct)
router.get("/:id", getProductById)
router.post("/upsert", upsertProduct)
router.delete("/:id", checkIfAdmin, deleteProductById)

export default router
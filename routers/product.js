import express from "express";
import { listProduct, upsertProduct, deleteProductById, getProductById } from "../controllers/product.js";
import { logRequests } from "../middlewares/logs.js";

const router = express.Router()

router.post("/", logRequests, listProduct)
router.get("/:id", logRequests, getProductById)
router.delete("/:id", logRequests, deleteProductById)
router.post("/upsert", logRequests, upsertProduct)

export default router
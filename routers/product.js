import express from "express";
import { listProduct, upsertProduct, getProductById, updateProductSalePrice, getProductByName } from "../controllers/product.js";
import { checkIfAdmin } from "../middlewares/auth.js";

const router = express.Router()

router.post("/", listProduct)
router.get("/:id", getProductById)
router.post("/name", getProductByName)
router.post("/upsert", checkIfAdmin, upsertProduct)
router.put("/:id/update-sale-price", checkIfAdmin, updateProductSalePrice)
// router.delete("/:id", checkIfAdmin, deleteProductById)

export default router
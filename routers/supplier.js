import express from "express";
import { listSuppliers, getSupplierById, upsertSupplier, deleteSupplierById, checkSupplierName } from "../controllers/supplier.js";

const router = express.Router()

router.get("/", listSuppliers)
router.get("/:id", getSupplierById)
router.get("/check-name/:name", checkSupplierName)
router.post("/upsert", upsertSupplier)
router.delete("/:id", deleteSupplierById)

export default router
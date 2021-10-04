import express from "express";
import { listSupplier, getSupplierById, upsertSupplier, deleteSupplierById } from "../controllers/supplier.js";

const router = express.Router()

router.get("/", listSupplier)
router.get("/:id", getSupplierById)
router.post("/upsert", upsertSupplier)
router.delete("/:id", deleteSupplierById)

export default router
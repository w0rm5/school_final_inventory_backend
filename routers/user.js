import express from "express";
import { upsertUser } from "../controllers/user.js";

const router = express.Router()

router.post("/upsert", upsertUser)

export default router
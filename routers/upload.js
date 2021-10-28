import express from "express";
import { upload } from "../utils/upload.js";
import { verifyToken, checkIfAdmin } from "../middlewares/auth.js";

const router = express.Router()

router.post("/upload", verifyToken, checkIfAdmin, upload.single("file"), singleUpload);

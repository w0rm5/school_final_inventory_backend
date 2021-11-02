import express from "express";
import { upload } from "../utils/upload.js";
import { verifyToken, checkIfAdmin } from "../middlewares/auth.js";
import { singleUpload, multiUpload, getFile, deleteFile, deleteMultipleFiles } from "../controllers/upload.js";

const router = express.Router()

router.get("/:filename", getFile);
router.post("/upload", verifyToken, checkIfAdmin, upload.single("file"), singleUpload);
router.post("/uploads", verifyToken, checkIfAdmin, upload.array("file"), multiUpload);
router.delete("/:filename", verifyToken, checkIfAdmin, deleteFile);
router.post("/delete", verifyToken, checkIfAdmin, deleteMultipleFiles);

export default router
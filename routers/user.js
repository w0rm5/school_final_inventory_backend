import express from "express";
import { registerUser, updateUser, resetPassword, forceResetPassword, listUser, getUserInfo, getUser, checkUserExist } from "../controllers/user.js";
import { checkIfAdmin } from "../middlewares/auth.js";

const router = express.Router({ mergeParams: true })

router.post("/", checkIfAdmin, listUser)
router.post("/register", checkIfAdmin, registerUser)
router.put("/update", checkIfAdmin, updateUser)
router.put("/reset-password", resetPassword )
router.put("/force-reset-password", checkIfAdmin, forceResetPassword )
router.get("/info", getUserInfo)
router.get("/:id", getUser)
router.post("/exist", checkUserExist)

export default router
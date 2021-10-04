import express from "express";
import { registerUser, updateUser, resetPassword, forceResetPassword, listUser } from "../controllers/user.js";
import { checkIfAdmin } from "../middlewares/auth.js";

const router = express.Router({ mergeParams: true })

router.post("/", checkIfAdmin, listUser)
router.post("/register", checkIfAdmin, registerUser)
router.put("/update", checkIfAdmin, updateUser)
router.put("/resetpassword", resetPassword )
router.put("/forceresetpassword", checkIfAdmin, forceResetPassword )

export default router
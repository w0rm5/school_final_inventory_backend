import jwt from "jsonwebtoken"
import { meta } from "../utils/enum.js";
import User from "../models/user.js";

export async function verifyToken(req, res, next) {
    let token = req.headers["x-access-token"]
    if(!token) {
        res.status(meta.UNAUTHORIZED).json({ meta: meta.UNAUTHORIZED, message: "User not logged in"})
        return;
    }
    try {
        let user = jwt.verify(token, process.env.TOKEN_KEY)
        let userInfo = await User.findById(user._id)
        if(!userInfo) {
            res.status(meta.FORBIDDEN).json({ meta: meta.FORBIDDEN, message: "You are not found in the list of employees"})
            return
        }
        req.userInfo = userInfo
        next()
    } catch (error) {
        res.status(meta.UNAUTHORIZED).json({meta: meta.UNAUTHORIZED, message: "Token expired or invalid"})
        return;
    }
}

export async function checkIfAdmin(req, res, next) {
    if(!req.userInfo.is_admin) {
        res.status(meta.FORBIDDEN).json({ meta: meta.FORBIDDEN, message: "You do not have permission to perform such action" })
        return
    }
    next()
}
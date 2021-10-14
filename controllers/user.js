import { meta } from "../utils/enum.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { findOne, find, upsertById, findById, findByIdAndDelete, defaultCallback } from "../utils/funcs.js";

const table_name = 'user'
const resetPasswordCallback = (res) => (err, doc) => {
    if (err) {
        res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: err.message });
        return;
    }
    let { password, ...user } = doc.toObject()
    res.status(meta.OK).json({ meta: meta.OK, data: user });
}

export async function registerUser(req, res) {
    try {
        let user = req.body
        if(!(user.first_name && user.last_name && user.sex && user.date_of_birth && user.username && user.password)){
            res.status(meta.BAD_REQUEST).json({meta: meta.BAD_REQUEST, message: "Please input all required fields"})
            return
        }
        if(user.password.lenght < 6) {
            res.status(meta.BAD_REQUEST).json({meta: meta.BAD_REQUEST, message: "Password must be at least 6-character long"})
            return
        }
        findOne(table_name, { username: user.username }, async (errFound, docFound) => {
            if (errFound) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: errFound.message });
                return;
            }
            if(docFound) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "username already taken" });
                return;
            }
            user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10))
            upsertById(table_name, null, user, resetPasswordCallback(res))
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function updateUser(req, res) {
    try {
        let user = req.body
        if(!user._id) {
            res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "User's id is missing, please contact technical support" })
            return
        }
        if(!req.userInfo.is_admin){
            res.status(meta.FORBIDDEN).json({ meta: meta.FORBIDDEN, message: "You do not have permission to perform such action" })
            return
        }
        upsertById(table_name, user._id, user, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function resetPassword(req, res) {
    try {
        let { oldPassword, newPassowrd } = req.body
        if(newPassowrd.lenght < 6) {
            res.status(meta.BAD_REQUEST).json({meta: meta.BAD_REQUEST, message: "Password must be at least 6-character long"})
            return
        }
        findById(table_name, req.userInfo._id, async (errFound, docFound) => {
            if (errFound) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: errFound.message });
                return;
            }
            if(!docFound) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Cannot reset password, user not found" });
                return
            }
            if(await bcrypt.compare(oldPassword, docFound.password)) {
                newPassowrd = await bcrypt.hash(newPassowrd, await bcrypt.genSalt(10))
                upsertById(table_name, docFound._id, { password: newPassowrd }, resetPasswordCallback(res))
            } else {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Wrong old password, cannot reset password" })
            }
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function forceResetPassword(req, res) {
    try {
        let { user_id, newPassowrd } = req.body
        if(newPassowrd.lenght < 6) {
            res.status(meta.BAD_REQUEST).json({meta: meta.BAD_REQUEST, message: "Password must be at least 6-character long"})
            return
        }
        findById(table_name, user_id, async (errFound, docFound) => {
            if (errFound) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: errFound.message });
                return;
            }
            if(!docFound) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Cannot reset password, user not found" });
                return
            }
            newPassowrd = await bcrypt.hash(newPassowrd, await bcrypt.genSalt(10))
            upsertById(table_name, docFound._id, { password: newPassowrd }, resetPasswordCallback(res))
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function login(req, res) {
    try {
        let { username, password } = req.body
        if(!(username && password)) {
            res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Please input all required fields" })
            return
        }
        findOne(table_name, { username }, async (errFound, docFound) => {
            if (errFound) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: errFound.message });
                return;
            }
            if(docFound && (await bcrypt.compare(password, docFound.password))) {
                return jwt.sign(
                    { _id: docFound._id }, 
                    process.env.TOKEN_KEY, 
                    { expiresIn: '7d' },
                    (err, encoded) => {
                        if(err) {
                            res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message })
                            return
                        }
                        return res.status(meta.OK).json({ meta: meta.OK, token: encoded })
                    }
                )
            }
            res.status(meta.UNAUTHORIZED).json({ meta: meta.UNAUTHORIZED, message: "Incorrect username or password" });
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function listUser(req, res) {
    try {
        let { filter, option } = req.body
        find(table_name, filter, '-password', option, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getUserInfo(req, res) {
    try {
        res.status(meta.OK).json({ meta: meta.OK, info: req.userInfo })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
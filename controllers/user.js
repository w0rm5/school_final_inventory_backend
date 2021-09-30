import { meta } from "../utils/enum.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { findOne, findAll, upsertById, findById, findByIdAndDelete, defaultCallback } from "../utils/funcs.js";

const table_name = 'user'

export async function upsertUser(req, res) {
    try {
        let user = req.body
        if(!(user.first_name && user.last_name && user.sex && user.date_of_birth && user.username && user.password)){
            res.status(meta.ERROR).json({meta: meta.ERROR, message: "Please input all required fields"})
            return
        }
        findOne(table_name, { username: user.username }, async (errFound, docFound) => {
            if (errFound) {
                res.status(meta.ERROR).json({ meta: meta.ERROR, message: errFound.message });
                return;
            }
            if(docFound) {
                res.status(meta.ERROR).json({ meta: meta.ERROR, message: "username already taken" });
                return;
            }
            user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10))
            upsertById(table_name, user._id, user, (errUpsert, docUpsert) => {
                if (errUpsert) {
                    res.status(meta.ERROR).json({ meta: meta.ERROR, message: errUpsert.message });
                    return;
                }
                let { password, ...user } = docUpsert.toObject()
                res.status(meta.OK).json({ meta: meta.OK, data: user });
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function login(req, res) {
    try {
        let { username, password } = req.body
        if(!(username && password)) {
            res.status(meta.ERROR).json({ meta: meta.ERROR, message: "Please input all required fields" })
            return
        }
        findOne(table_name, { username }, async (errFound, docFound) => {
            if (errFound) {
                res.status(meta.ERROR).json({ meta: meta.ERROR, message: errFound.message });
                return;
            }
            if(docFound && (await bcrypt.compare(password, docFound.password))) {
                return jwt.sign(
                    { _id: docFound._id, username }, 
                    process.env.TOKEN_KEY, 
                    { expiresIn: '7d' },
                    (err, encoded) => {
                        if(err) {
                            res.status(meta.INTERNAL_ERROR).json({ meta: meta.ERROR, message: err.message })
                            return
                        }
                        return res.status(meta.OK).json({ meta: meta.OK, token: encoded })
                    }
                )
            }
            res.status(meta.UNAUTHORIZED).json({ meta: meta.UNAUTHORIZED, message: "Incorrect username or password" });
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.ERROR, message: error.message })
    }
}
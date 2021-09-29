import { meta } from "../utils/enum.js";
import { findAll, upsertById, findById, findByIdAndDelete, defaultCallback } from "../utils/funcs.js";

const table_name = 'user'

export async function registerUser(req, res) {
    try {
        
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.ERROR, message: error.message })
    }
}
import { meta } from "../utils/enum.js";
import { insert, defaultCallback } from "../utils/funcs.js";

const table_name = "stock_in"

export async function createStockIn(req, res) {
    try {
        insert(table_name, req.body, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
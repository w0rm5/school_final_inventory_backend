import { meta } from "../utils/enum.js";
import { findAll, upsertById, findById, findByIdAndDelete, defaultCallback } from "../utils/funcs.js";

const table_name = 'product'

const callback = res => async (err, doc) => {
    if (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
        return;
    }
    await doc.populate("category")
    res.status(200).json({ meta: meta.OK, data: doc });
}

export async function listProduct(req, res) {
    try {
        const findAllCallback = res => async (err, docs) => {
            if (err) {
                res.status(400).json({ meta: meta.ERROR, message: err.message });
                return;
            }
            for (let doc of docs) {
                await doc.populate("category")
            }
            res.status(200).json({ meta: meta.OK, data: docs });
        }
        findAll(table_name, findAllCallback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function upsertProduct(req, res) {
    try {
        upsertById(table_name, req.body._id, req.body, callback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function getProductById(req, res) {
    try {
        findById(table_name, req.params.id, callback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function deleteProductById(req, res) {
    try {
        findByIdAndDelete(table_name, req.params.id, defaultCallback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}
import { meta } from "../utils/enum.js";
import { findOne, findAll, upsertById, findById, findByIdAndDelete, defaultCallback } from "../utils/funcs.js";

const table_name = 'category'
const product_table_name = 'product'

export async function listCategory(req, res) {
    try {
        findAll(table_name, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function upsertCategory(req, res) {
    try {
        upsertById(table_name, req.body._id, req.body, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getCategoryById(req, res) {
    try {
        findById(table_name, req.params.id, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function deleteCategoryById(req, res) {
    try {
        let catId = req.params.id
        findOne(product_table_name, { category: catId }, (err, doc) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
                return;
            }
            if (doc) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Cannot delete a category that is in used." });
                return;
            }
            findByIdAndDelete(table_name, catId, defaultCallback(res))
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
import { meta } from "../utils/enum.js";
import { findAll, upsertById, findById, findByIdAndDelete, defaultCallback } from "../utils/funcs.js";

const table_name = 'category'

export async function listCategory(req, res) {
    try {
        findAll(table_name, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function upsertCategory(req, res) {
    try {
        upsertById(table_name, req.body._id, req.body, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function getCategoryById(req, res) {
    try {
        findById(table_name, req.params.id, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function deleteCategoryById(req, res) {
    try {
        findByIdAndDelete(table_name, req.params.id, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.ERROR, message: error.message })
    }
}
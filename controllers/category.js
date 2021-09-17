import { meta } from "../utils/enum.js";
import { findAll, upsertById, findById, findByIdAndDelete, defaultCallback } from "../utils/funcs.js";

const category_t = 'category'

export async function listCategory(req, res) {
    try {
        findAll(category_t, defaultCallback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function upsertCategory(req, res) {
    try {
        upsertById(category_t, req.body._id, req.body, defaultCallback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function getCategoryById(req, res) {
    try {
        findById(category_t, req.params.id, defaultCallback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function deleteCategoryById(req, res) {
    try {
        findByIdAndDelete(category_t, req.params.id, defaultCallback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}
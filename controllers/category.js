import Category from "../models/category.js";
import { meta } from "../utils/enum.js";
import { findAll, upsertById } from "../utils/funcs.js";

const category_t = 'category'

const defaultCallback = res => (err, doc) => {
    if (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
        return;
    }
    res.status(200).json({ meta: meta.OK, data: doc });
}

export async function listCategory(req, res) {
    try {
        findAll(category_t, defaultCallback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function upsertCategory(req, res) {
    try {
        upsertById(category_t, req.body._id, category, defaultCallback(res))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}
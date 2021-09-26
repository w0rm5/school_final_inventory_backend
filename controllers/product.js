import { meta } from "../utils/enum.js";
import { findAll, upsertById, findById, findByIdAndDelete, defaultCallback, populateCallback } from "../utils/funcs.js";

const table_name = 'product'

export async function listProduct(req, res) {
    try {
        findAll(table_name, populateCallback(res, table_name, 'category'))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function upsertProduct(req, res) {
    try {
        upsertById(table_name, req.body._id, req.body, populateCallback(res, table_name, 'category'))
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function getProductById(req, res) {
    try {
        findById(table_name, req.params.id, populateCallback(res, table_name, 'category'))
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
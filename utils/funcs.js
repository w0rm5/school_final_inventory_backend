import mongoose from "mongoose";
import { meta } from './enum.js'

import category from '../models/category.js'
import product from '../models/product.js'
import supplier from '../models/supplier.js'
import stock_info from '../models/stock_info.js'
import stock_in_item from '../models/stock_in_item.js'
import stock_in from '../models/stock_in.js'
import stock_out_item from '../models/stock_out_item.js'
import stock_out from '../models/stock_out.js'

const tables = {
    category,
    product,
    supplier,
    stock_info,
    stock_in,
    stock_in_item,
    stock_out,
    stock_out_item,
}

export const defaultCallback = (res, table, path) => async (err, doc) => {
    if (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
        return;
    }
    if (!doc /*|| (Array.isArray(doc) && !doc.length)*/) {
        res.status(404).json({ meta: meta.NOTFOUND, message: "Not found" });
        return;
    }
    if (path) {
        await tables[table].populate(doc, path)
    }
    res.status(200).json({ meta: meta.OK, data: doc });
}

export function findById(table, id, callback) {
    tables[table].findById(id, callback)
}

export function findByIdAndDelete(table, id, callback) {
    tables[table].findByIdAndDelete(id, callback)
}

export function find(table, filter, callback) {
    tables[table].find(filter, callback)
}

export function findAll(table, callback) {
    find(table, {}, callback)
}

export function upsertById(table, id, update, callback) {
    tables[table].findOneAndUpdate({ _id: id || new mongoose.Types.ObjectId() }, update, { upsert: true, new: true }, callback)
}

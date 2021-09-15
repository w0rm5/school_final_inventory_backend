import mongoose from "mongoose";

import category from '../models/category.js'
import product from '../models/product.js'
import supplier from '../models/supplier.js'
import stock_info from '../models/stock_info.js'
import stock_in_item from '../models/stock_in_item.js'
import stock_in from '../models/stock_in.js'

const tables = {
    category,
    product,
    supplier,
    stock_info,
    stock_in,
    stock_in_item,
}

export function find(table, filter, callback){
    tables[table].find(filter, callback)
}

export function findAll(table, callback) {
    find(table, {}, callback)
}

export function upsertById(table, id, update, callback) {
    tables[table].findOneAndUpdate({ _id: id || new mongoose.Types.ObjectId() }, update, { upsert: true, new: true }, callback)
}
import { meta, stockInTypes } from "../utils/enum.js";
import { insert, defaultCallback, find, findById, populate } from "../utils/funcs.js";
import Product from "../models/product.js";

const table_name = "stock_in"
const stock_in_item_t = "stock_in_item"

export async function createStockIn(req, res) {
    try {
        let { stock_in, stock_in_items } = req.body

        insert(table_name, stock_in, (err, doc) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
                return;
            }
            for (let item of stock_in_items) {
                item.stock_in = doc._id
                item.type = doc.type
                item.date = doc.date
            }
            insert(stock_in_item_t, stock_in_items, async (errItem, docs) => {
                if (errItem) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errItem.message });
                    return;
                }
                try {
                    for (let item of docs) {
                        let p = await Product.findOne({ _id: item.product, discontinued: false })
                        if(!p) {
                            res.status(meta.NOT_FOUND).json({ meta: meta.NOT_FOUND, message: "Product not found" })
                            return
                        }
                        if (item.type == stockInTypes.PURCHASE) {
                            p.cost_history.push({
                                stock_in_item: item._id,
                                cost: item.cost,
                                remaining_qty: item.quantity
                            })
                        }
                        p.current_quantity += item.quantity
                        await Product.updateOne({ _id: p._id}, p)
                        item.product = p
                    }
                    let r = { stock_in: doc, products: docs }
                    res.status(meta.OK).json({ meta: meta.OK, doc: r })
                } catch (errfindP) {
                    console.log("product find error: ", errfindP);
                    throw errfindP
                }
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getStockIn(req, res) {
    try {
        findById(table_name, req.params.id, (err, doc) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
                return;
            }
            if (!doc) {
                res.status(meta.NOT_FOUND).json({ meta: meta.NOT_FOUND, message: "Not found" });
                return;
            }
            find(stock_in_item_t, { stock_in: doc._id }, "-stock_in -date", null, async (errFound, docsFound) => {
                if (errFound) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errFound.message });
                    return;
                }
                let path = {
                    path: "product",
                    populate: {
                        path: "category"
                    }
                }
                await populate(stock_in_item_t, docsFound, path)
                let r = { stock_in: doc, products: docsFound }
                res.status(meta.OK).json({ meta: meta.OK, doc: r })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getAllStockIns(req, res) {
    try {
        let { filter, option } = req.body
        find(table_name, filter, null, option, defaultCallback(res, table_name, 'supplier'))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
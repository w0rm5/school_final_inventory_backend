import { meta, stockInTypes } from "../utils/enum.js";
import { insert, defaultCallback, find, findById, upsertById, populate } from "../utils/funcs.js";
import Product from "../models/product.js";

const table_name = "stock_in"
const stock_in_item_t = "stock_in_item"
const product_t = "product"

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
                        let p = await Product.findById(item.product)
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
            find(stock_in_item_t, { stock_in: doc._id }, "-stock_in", null, async (errFound, docsFound) => {
                if (errFound) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errFound.message });
                    return;
                }
                await populate(stock_in_item_t, docsFound, "product")
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
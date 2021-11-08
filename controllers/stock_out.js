import { meta, stockOutTypes } from "../utils/enum.js";
import { insert, defaultCallback, find, findById } from "../utils/funcs.js";
import Product from "../models/product.js";

const table_name = "stock_out"
const stock_out_item_t = "stock_out_item"

export async function createStockOut(req, res) {
    try {
        let { stock_out, stock_out_items } = req.body
        stock_out.by = req.userInfo._id
        let products = []
        for (let item of stock_out_items) {
            let p = await Product.findOne({ _id: item.product, discontinued: false })
            if (!p) {
                res.status(meta.NOT_FOUND).json({ meta: meta.NOT_FOUND, message: "Error! product(s) not found." });
                return
            }
            if (p.current_quantity < item.quantity) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Not enough quantity for " + p.name });
                return
            }
            if (stock_out.type == stockOutTypes.SALE){
                item.sale_price = p.current_sale_price
            }
            let cost_histories = []
            if(p.cost_history[0].remaining_qty < item.quantity) {
                let qty = 0
                while (qty < item.quantity) {
                    if (stock_out.type == stockOutTypes.SALE) {
                        cost_histories.push(Object.assign({}, p.cost_history[0]))
                    }
                    qty += p.cost_history[0].remaining_qty
                    if(qty <= item.quantity) {
                        p.cost_history.shift()
                    }else{
                        p.cost_history[0].remaining_qty = qty - item.quantity
                        if (stock_out.type == stockOutTypes.SALE) {
                            cost_histories[cost_histories.length - 1].remaining_qty -= p.cost_history[0].remaining_qty
                        }
                    }
                }
            } else {
                if (stock_out.type == stockOutTypes.SALE) {
                    cost_histories.push(Object.assign({}, p.cost_history[0]))
                }
                p.cost_history[0].remaining_qty -= item.quantity
                if(p.cost_history[0].remaining_qty === 0) {
                    p.cost_history.shift()
                }
            }
            if (stock_out.type == stockOutTypes.SALE) {
                let totalCost = 0, cLength = cost_histories.length
                //Array.reduce works too, but it's slower than traditional For Loop
                for(let i = 0; i < cLength; i++) {
                    totalCost += cost_histories[i].cost * cost_histories[i].remaining_qty
                }
                item.cost = Math.round(((totalCost / item.quantity) + Number.EPSILON) * 100 ) / 100
            }
            p.current_quantity -= item.quantity
            products.push(p)
        }
        
        insert(table_name, stock_out, (err, doc) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
                return;
            }
            for (let item of stock_out_items) {
                item.stock_out = doc._id
                item.type = doc.type
                item.date = doc.date
            }
            insert(stock_out_item_t, stock_out_items, async (errItem, docs) => {
                if (errItem) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errItem.message });
                    return;
                }
                for (let item of docs) {
                    let p = products.find(e => e._id.toString() == item.product)
                    await Product.updateOne({ _id: p._id}, p)
                    item.product = p
                }
                let r = { stock_out: doc, product: docs }
                res.status(meta.OK).json({ meta: meta.OK, doc: r })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getStockOut(req, res) {
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
            find(stock_out_item_t, { stock_out: doc._id }, "-stock_out", null, async (errFound, docsFound) => {
                if (errFound) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errFound.message });
                    return;
                }
                await populate(stock_out_item_t, docsFound, "product")
                let r = { stock_out: doc, products: docsFound }
                res.status(meta.OK).json({ meta: meta.OK, doc: r })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getAllStockOuts(req, res) {
    try {
        let { filter, option } = req.body
        find(table_name, filter, null, option, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
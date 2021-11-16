import { meta, stockOutTypes } from "../utils/enum.js";
import { insert, defaultCallback, find, findById, findOne, getCode, populate, countDocs } from "../utils/funcs.js";
import Product from "../models/product.js";
import AutoNumber from "../models/auto_number.js";

const table_name = "stock_out"
const stock_out_item_t = "stock_out_item"
const stock_in_item_t = "stock_in_item"

function insertStockOut(stock_out, stock_out_items, products, res) {
    insert(table_name, stock_out, (err, doc) => {
        if (err) {
            res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
            return;
        } else {
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
                res.status(meta.OK).json({ meta: meta.OK, message: doc.type === stockOutTypes.SALE ? "Sale created" : "Purchase stocked out" });
            })
        }
    })
}

const getStockOutCallback = res => (err, doc) => {
    if (err) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
        return;
    }
    if (!doc) {
        res.status(meta.NOT_FOUND).json({ meta: meta.NOT_FOUND, message: "Not found" });
        return;
    }
    find(stock_out_item_t, { stock_out: doc._id }, "-stock_out -date -type", null, async (errFound, docsFound) => {
        if (errFound) {
            res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errFound.message });
            return;
        }
        let path = [
            {
                path: "by",
                select: "first_name last_name",
            },
            "supplier"
        ];
        let itemsPath = {
            path: "product",
            select: "name images barcode category",
            populate: {
                path: "category"
            }
        }
        await populate(table_name, doc, path)
        await populate(stock_out_item_t, docsFound, itemsPath)

        find(stock_in_item_t, { sale_return: doc._id }, "-stock_in -date -type", null, (errStockIn, docsStockIn) => {
            if (errStockIn) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errStockIn.message });
                return;
            }
            let r = { stock_out: doc, products: docsFound, return: docsStockIn }
            res.status(meta.OK).json({ meta: meta.OK, data: r })
        })
    })
}

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
                    cost_histories.push(Object.assign({}, p.cost_history[0]))
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
                cost_histories.push(Object.assign({}, p.cost_history[0]))
                p.cost_history[0].remaining_qty -= item.quantity
                if(p.cost_history[0].remaining_qty === 0) {
                    p.cost_history.shift()
                }
            }
            let totalCost = 0, totalQuantity = 0, cLength = cost_histories.length
            for(let i = 0; i < cLength; i++) {
                totalCost += cost_histories[i].cost * cost_histories[i].remaining_qty
                totalQuantity += cost_histories[i].remaining_qty
            }
            item.cost = Math.round(((totalCost / totalQuantity) + Number.EPSILON) * 100 ) / 100
            p.current_quantity -= item.quantity
            products.push(p)
        }
        if(stock_out.type == stockOutTypes.SALE) {
            AutoNumber.findOneAndUpdate(
                { prefix: "S" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true },
                (err, result) => {
                    if (err) {
                        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
                        return;
                    } else {
                        stock_out.transaction_no = getCode(result.prefix, result.seq, 6);
                        insertStockOut(stock_out, stock_out_items, products, res)
                    }
                }
            );
        } else {
            insertStockOut(stock_out, stock_out_items, products, res)
        }
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getStockOutById(req, res) {
    try {
        findById(table_name, req.params.id, getStockOutCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getStockOutByTransNum(req, res) {
    try {
        findOne(table_name, { transaction_no : req.params.trans_no }, getStockOutCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getAllStockOuts(req, res) {
    try {
        let { filter, option } = req.body
        let path = [
            {
                path: "by",
                select: "first_name last_name",
            }
        ];
        if(filter.date) {
            filter.date = {
                $gte: new Date(filter.date[0]),
                $lt: new Date(filter.date[1])
            }
        }
        countDocs(table_name, filter, (errCount, count) => {
            if(errCount) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errCount.message })
                return
            }
            find(table_name, filter, null, option, async (err, docs) => {
                if(err) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message })
                    return
                }
                await populate(table_name, docs, path)
                res.status(meta.OK).json({ meta: meta.OK, data: docs, count })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
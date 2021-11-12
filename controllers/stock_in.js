import { meta, stockInTypes } from "../utils/enum.js";
import { insert, defaultCallback, find, findById, populate, getCode } from "../utils/funcs.js";
import Product from "../models/product.js";
import AutoNumber from "../models/auto_number.js";

const table_name = "stock_in"
const stock_in_item_t = "stock_in_item"

function insertStockIn(stock_in, stock_in_items, res) {
    insert(table_name, stock_in, (err, doc) => {
        if (err) {
            throw err;
        }
        for (let item of stock_in_items) {
            item.stock_in = doc._id
            item.type = doc.type
            item.date = doc.date
        }
        insert(stock_in_item_t, stock_in_items, async (errItem, docs) => {
            if (errItem) {
                throw errItem;
            }
            try {
                for (let item of docs) {
                    let p = await Product.findOne({ _id: item.product, discontinued: false })
                    if(!p) {
                        res.status(meta.NOT_FOUND).json({ meta: meta.NOT_FOUND, message: "Product not found" })
                        return
                    }
                    p.cost_history.push({
                        stock_in_item: item._id,
                        cost: item.cost,
                        remaining_qty: item.quantity
                    })
                    p.current_quantity += item.quantity
                    await Product.updateOne({ _id: p._id}, p)
                    item.product = p
                }
                res.status(meta.OK).json({ meta: meta.OK, message: "Products stocked in" })
            } catch (errfindP) {
                console.log("product find error: ", errfindP);
                throw errfindP
            }
        })
    })
}

export async function createStockIn(req, res) {
    try {
        let { stock_in, stock_in_items } = req.body
        stock_in.by = req.userInfo._id
        if (stock_in.type == stockInTypes.PURCHASE) {
            AutoNumber.findOneAndUpdate(
              { prefix: "P" },
              { $inc: { seq: 1 } },
              {
                new: true,
                upsert: true,
              },
              function (err, result) {
                if (err) {
                  throw err;
                } else {
                  stock_in.transaction_no = getCode(result.prefix, result.seq, 6);
                  insertStockIn(stock_in, stock_in_items, res)
                }
              }
            );
          } else {
            insertStockIn(stock_in, stock_in_items, res)
          }
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
            find(stock_in_item_t, { stock_in: doc._id }, "-stock_in -date -type", null, async (errFound, docsFound) => {
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
                await populate(stock_in_item_t, docsFound, itemsPath)
                let r = { stock_in: doc, products: docsFound }
                res.status(meta.OK).json({ meta: meta.OK, data: r })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getAllStockIns(req, res) {
    try {
        let { filter, option } = req.body
        let path = [
            {
                path: "by",
                select: "first_name last_name",
            },
            "supplier"
        ];
        if(filter.date) {
            filter.date = {
                $gte: new Date(filter.date[0]),
                $lt: new Date(filter.date[1])
            }
        }
        find(table_name, filter, null, option, defaultCallback(res, table_name, path))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
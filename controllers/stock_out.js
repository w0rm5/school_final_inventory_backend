import { meta, stockOutTypes } from "../utils/enum.js";
import { insert, defaultCallback, find, findById, upsertById } from "../utils/funcs.js";
import Product from "../models/product.js";

const table_name = "stock_out"
const stock_out_item_t = "stock_out_item"
// const product_t = "product"

export async function createStockOut(req, res) {
    try {
        let { stock_out, stock_out_items } = req.body
        let products = []
        for (let item of stock_out_items) {
            let p = await Product.findById(item.product)
            if (!p) {
                res.status(meta.NOT_FOUND).json({ meta: meta.NOT_FOUND, message: "Error! product(s) not found." });
                return
            }
            if (p.current_quantity < item.quantity) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Not enough quantity for " + p.name });
                return
            }
            if (stock_out.type == stockOutTypes.SALE) {
                item.sale_price = p.current_sale_price
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
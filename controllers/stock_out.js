import { meta, stockOutTypes } from "../utils/enum.js";
import { insert, defaultCallback, find, findById, upsertById } from "../utils/funcs.js";

const table_name = "stock_out"
const stock_out_item_t = "stock_out_item"
const product_t = "product"

export async function createStockOut(req, res) {
    try {
        let { stock_out, stock_out_items } = req.body
        let products = []
        for(let item of stock_out_items) {
            let enoughStock = findById(product_t, item.product, (err, doc) => {
                if(err) {
                    return err
                }
                if(!doc){
                    return { message: "Product not found" }
                }
                if(doc.current_quantity < item.quantity) {
                    return false
                }
                if(stock_out.type == stockOutTypes.SALE) {
                    item.sale_price = doc.current_sale_price
                }
                doc.current_quantity -= item.quantity
                products.push(doc)
                return true
            })
            if(enoughStock === false) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Not enough product quantity" });
                return
            }else if (enoughStock && enoughStock !== true) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: enoughStock.message });
                return
            }
        }
        insert(table_name, stock_out, (err, doc) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
                return;
            }
            for(let item of stock_out_items) {
                item.stock_out = doc._id
                item.type = doc.type
                
            }
            insert(stock_out_item_t, stock_out_items, (errItem, docs) => {
                if (errItem) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errItem.message });
                    return;
                }
                for(let item of products) {
                    upsertById(product_t, item._id, item, (errP, docP) => {

                    })
                }
                let r = { doc, products }
                res.status(meta.OK).json({ meta: meta.OK, doc: r })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
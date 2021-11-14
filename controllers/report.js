import { meta } from "../utils/enum.js";
import { find } from "../utils/funcs.js";

const stock_in_t = "stock_in"
const stock_in_item_t = "stock_in_item"

export async function getStockInReports(req, res) { 
    try {
        let { filter, option } = req.body
        filter.date = {
            $gte: new Date(filter.date[0]),
            $lt: new Date(filter.date[1])
        }
        find(stock_in_t, filter, null, option, (err, docs) => {
            if(err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message })
                return
            }
            find(stock_in_item_t, filter, null, option, (err_item, docs_item) => {
                if(err_item) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err_item.message })
                    return
                }
                res.status(meta.OK).json({ meta: meta.OK, data: { stock_ins: docs, stock_in_items: docs_item } })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
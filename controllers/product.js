import { meta } from "../utils/enum.js";
import { find, upsertById, findById, findByIdAndDelete, defaultCallback } from "../utils/funcs.js";

const table_name = 'product'

export async function listProduct(req, res) {
    try {
        let { filter, option } = req.body
        find(table_name, filter, null, option, defaultCallback(res, table_name, 'category'))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function upsertProduct(req, res) {
    try {
        upsertById(table_name, req.body._id, req.body, defaultCallback(res, table_name, 'category'))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function updateProductSalePrice(req, res) {
    try {
        let id = req.params.id
        let update_price = req.body.update_price
        if(update_price < 0) {
            res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Sale price cannot be less than 0." });
            return;
        }
        findById(table_name, id, (err, doc) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
                return;
            }
            if (!doc) {
                res.status(meta.NOT_FOUND).json({ meta: meta.NOT_FOUND, message: "Product not found" });
                return;
            }
            doc.sale_price_history.push({
                change_date: new Date(),
                old_price: doc.current_sale_price
            })
            doc.current_sale_price = update_price
            upsertById(table_name, id, doc, (errUpdate, _) => {
                if(errUpdate) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errUpdate.message });
                    return;
                }
                res.status(meta.OK).json({ meta: meta.OK, message: "Sale price updated" });
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getProductById(req, res) {
    try {
        findById(table_name, req.params.id, defaultCallback(res, table_name, 'category'))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function deleteProductById(req, res) {
    try {
        findByIdAndDelete(table_name, req.params.id, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
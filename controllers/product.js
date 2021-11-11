import { meta } from "../utils/enum.js";
import { find, findOne, upsertById, findById, defaultCallback } from "../utils/funcs.js";
import mongoose from "mongoose";

const table_name = 'product'

export async function listProduct(req, res) {
    try {
        let { filter, option, populatePath } = req.body
        if(filter.name) {
            filter.name = { $regex: filter.name, $options: 'i' }
        }
        if(filter.current_quantity) {
            filter.current_quantity = { $gt: 0 }
        }
        find(table_name, filter, null, option, defaultCallback(res, table_name, populatePath))
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
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Invalid Product ID" })
            return
        }
        findById(table_name, req.params.id, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getOneProduct(req, res) {
    try {
        const callback = (err, doc) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
                return;
            }
            if (!doc) {
                res.status(meta.OK).json({ meta: meta.NOT_FOUND });
                return;
            }
            res.status(meta.OK).json({ meta: meta.OK, id: doc._id });
        }
        findOne(table_name, req.body, callback)
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

// export async function deleteProductById(req, res) {
//     try {
//         findByIdAndDelete(table_name, req.params.id, defaultCallback(res))
//     } catch (error) {
//         res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
//     }
// }
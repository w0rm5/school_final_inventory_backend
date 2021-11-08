import { meta } from "../utils/enum.js";
import { findAll, upsertById, findById, findByIdAndDelete, defaultCallback, findOne } from "../utils/funcs.js";

const table_name = 'supplier'

export async function listSuppliers(req, res) {
    try {
        findAll(table_name, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function upsertSupplier(req, res) {
    try {
        upsertById(table_name, req.body._id, req.body, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getSupplierById(req, res) {
    try {
        findById(table_name, req.params.id, defaultCallback(res))
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function deleteSupplierById(req, res) {
    try {
        let supplierId = req.params.id
        findOne("stock_in", { supplier: supplierId }, (err, doc) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message });
                return;
            }
            if (doc) {
                res.status(meta.BAD_REQUEST).json({ meta: meta.BAD_REQUEST, message: "Current supplier is in used, cannot delete" });
                return;
            }
            findByIdAndDelete(table_name, supplierId, defaultCallback(res))
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function checkSupplierName(req, res) {
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
            res.status(meta.OK).json({ meta: meta.OK });
        }
        findOne(table_name, { name: req.params.name }, callback)
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
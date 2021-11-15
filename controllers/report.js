import { meta, stockInTypes, stockOutTypes } from "../utils/enum.js";
import { find, populate } from "../utils/funcs.js";
import excelJS from "exceljs";

const stock_in_t = "stock_in";
const stock_in_item_t = "stock_in_item"
const stock_out_t = "stock_out";
const stock_out_item_t = "stock_out_item"

const stock_in_types = {
    [stockInTypes.PURCHASE]: "Purchase",
    [stockInTypes.RETURN]: "Return",
    [stockInTypes.ADMIN_INCREASE]: "Manual Increase",
}

const stock_out_types = {
    [stockOutTypes.SALE]: "Sale",
    [stockOutTypes.SCRAP]: "Scrap",
    [stockOutTypes.ADMIN_DECREASE]: "Manual Decrease",
}

export async function getStockInReports(req, res) { 
    try {
        let { filter } = req.body
        if(filter.date){
            filter.date = {
                $gte: new Date(filter.date[0]),
                $lt: new Date(filter.date[1])
            }
        }
        find(stock_in_t, filter, null, null, (errMain, docsMain) => {
            if(errMain) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errMain.message })
                return
            }
            find(stock_in_item_t, { stock_in: { $in: docsMain.map(d => d._id) } }, null, null, async (err, docs) => {
                if(err) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message })
                    return
                }
                let path = [
                    {
                        path: "product",
                        select: "name barcode category",
                        populate: {
                            path: "category"
                        }
                    },
                    {
                        path: "stock_in",
                        select: "supplier by transaction_no remarks",
                        populate: [
                            {
                                path: "by",
                                select: "first_name last_name",
                            },
                            "supplier"
                        ]
                    },
                ]
                await populate(stock_in_item_t, docs, path)
                let workbook = new excelJS.Workbook();
                let worksheet = workbook.addWorksheet('Sheet 1');
                worksheet.columns = [
                    { header: 'No.', key: 'r_no', width: 5 },
                    { header: 'Type', key: 'type', width: 15 },
                    { header: 'Date', key: 'date', width: 12 },
                    { header: 'By', key: 'by', width: 20 },
                    { header: 'Product', key: 'product', width: 20 },
                    { header: 'Barcode', key: 'barcode', width: 10 },
                    { header: 'Category', key: 'category', width: 20 },
                    { header: 'Cost per unit', key: 'cost', width: 15 },
                    { header: 'Quantity', key: 'quantity', width: 10 },
                    { header: 'Supplier', key: 'supplier', width: 15 },
                    { header: 'Transaction No.', key: 'transaction_no', width: 15 },
                    { header: 'Remarks', key: 'remarks', width: 20 },
                ]
                let r_no = 1
                for(let doc of docs) {
                    worksheet.addRow({
                        r_no: r_no,
                        type: stock_in_types[doc.type],
                        date: doc.date,
                        by: doc.stock_in.by.first_name + " " + doc.stock_in.by.last_name,
                        product: doc.product.name,
                        barcode: doc.product.barcode,
                        category: doc.product.category.name,
                        cost: doc.cost,
                        quantity: doc.quantity,
                        supplier: doc.stock_in.supplier ? doc.stock_in.supplier.name : "",
                        transaction_no: doc.stock_in.transaction_no,
                        remarks: doc.stock_in.remarks
                    })
                    r_no++
                }
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                workbook.xlsx.write(res).then(() => {
                    res.end();
                }).catch(err => { 
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message })
                })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getStockOutReports(req, res) { 
    try {
        let { filter } = req.body
        if(filter.date){
            filter.date = {
                $gte: new Date(filter.date[0]),
                $lt: new Date(filter.date[1])
            }
        }
        find(stock_out_t, filter, null, null, (errMain, docsMain) => {
            if(errMain) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errMain.message })
                return
            }
            find(stock_out_item_t, { stock_out: { $in: docsMain.map(d => d._id) } }, null, null, async (err, docs) => {
                if(err) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message })
                    return
                }
                let path = [
                    {
                        path: "product",
                        select: "name barcode category",
                        populate: {
                            path: "category"
                        }
                    },
                    {
                        path: "stock_out",
                        select: "by transaction_no remarks",
                        populate: {
                            path: "by",
                            select: "first_name last_name",
                        }
                    },
                ]
                await populate(stock_out_item_t, docs, path)
                let workbook = new excelJS.Workbook();
                let worksheet = workbook.addWorksheet('Sheet 1');
                worksheet.columns = [
                    { header: 'No.', key: 'r_no', width: 5 },
                    { header: 'Type', key: 'type', width: 15 },
                    { header: 'Date', key: 'date', width: 12 },
                    { header: 'By', key: 'by', width: 20 },
                    { header: 'Product', key: 'product', width: 20 },
                    { header: 'Barcode', key: 'barcode', width: 10 },
                    { header: 'Category', key: 'category', width: 20 },
                    { header: 'Cost per unit', key: 'cost', width: 15 },
                    { header: 'Quantity', key: 'quantity', width: 10 },
                    { header: 'Transaction No.', key: 'transaction_no', width: 15 },
                    { header: 'Remarks', key: 'remarks', width: 20 },
                ]
                let r_no = 1
                for(let doc of docs) {
                    worksheet.addRow({
                        r_no: r_no,
                        type: stock_out_types[doc.type],
                        date: doc.date,
                        by: doc.stock_out.by.first_name + " " + doc.stock_out.by.last_name,
                        product: doc.product.name,
                        barcode: doc.product.barcode,
                        category: doc.product.category.name,
                        cost: doc.cost,
                        quantity: doc.quantity,
                        transaction_no: doc.stock_out.transaction_no,
                        remarks: doc.stock_out.remarks
                    })
                    r_no++
                }
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                workbook.xlsx.write(res).then(() => {
                    res.end();
                }).catch(err => { 
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message })
                })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
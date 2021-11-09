import mongoose from "mongoose"
import { stockInTypes } from "../utils/enum.js"

const StockInSchema = mongoose.Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    type: {
        type: Number,
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "supplier",
        required: function() {
            return this.type == stockInTypes.PURCHASE;
        }
    },
    transaction_no: {
        type: String,
        unique: true,
        required: function() {
            return this.type == stockInTypes.PURCHASE;
        },
    },
    attachments: {
        type: Array,
        default: []
    },
    remarks: {
        type: String,
        required: function() {
            return this.type != stockInTypes.PURCHASE;
        },
    },
    date: {
        type: Date,
        default: Date.now
    },
},
{
    versionKey: false
})

export default mongoose.model("stock_in", StockInSchema);
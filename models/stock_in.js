import mongoose from "mongoose"
import { stockInTypes } from "../utils/enum.js"

const StockInSchema = mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplier',
        required: () => this.type == stockInTypes.PURCHASE,
    },
    attachments: {
        type: Array,
        default: []
    },
    remarks: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
},
{
    versionKey: false
})

export default mongoose.model("stock_in", StockInSchema)
import mongoose from "mongoose"
import { stockInTypes } from "../utils/enum.js"

const StockInItemSchema = mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    stock_in: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock_in',
        required: true
    },
    stock_info: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock_info',
        required: true
    },
    cost: { //if stock in via purchase
        type: Number,
        min: 0,
        required: () => this.type == stockInTypes.purchase,
    },
    quantity: {
        type: Number,
        required: true
    }
},
    {
        versionKey: false
    })

export default mongoose.model("stock_in_item", StockInItemSchema)
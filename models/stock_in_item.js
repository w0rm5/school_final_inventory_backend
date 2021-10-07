import mongoose from "mongoose"
import { stockInTypes } from "../utils/enum.js"

const StockInItemSchema = mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    stock_in: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock_in',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    cost: { // per unit
        type: Number,
        min: 0,
        required: function() {
            return this.type == stockInTypes.PURCHASE
        },
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
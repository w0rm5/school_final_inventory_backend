import mongoose from "mongoose"
import { stockOutTypes } from "../utils/enum.js"

const StockOutItemSchema = mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    stock_out: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock_out',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    sale_price: { // per unit
        type: Number,
        min: 0,
        required: function() { 
            return this.type == stockOutTypes.SALE
        }
    },
    cost: { // per unit
        type: Number,
        min: 0,
        required: function() { 
            return this.type == stockOutTypes.SALE
        }
    },
    quantity: {
        type: Number,
        required: true
    }
},
{
    versionKey: false
})

export default mongoose.model("stock_out_item", StockOutItemSchema)
import mongoose from "mongoose"

const StockInfoSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    cost_history: { //from stock in
        type: Array,
        default: []
    },
    current_quantity: {
        type: Number,
        default: 0
    }
},
{
    versionKey: false
})

export default mongoose.model("stock_info", StockInfoSchema)
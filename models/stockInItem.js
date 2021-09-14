import mongoose from "mongoose"

const StockInItemSchema = mongoose.Schema({
    stockIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock_in',
        required: true
    },
    stockInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock_info',
        required: true
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
import mongoose from "mongoose"

const StockOutItemSchema = mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    stock_out: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock_out',
        required: true
    },
    stock_info: {
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

export default mongoose.model("stock_out_item", StockOutItemSchema)
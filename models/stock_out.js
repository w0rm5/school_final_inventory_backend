import mongoose from "mongoose"

const StockOutSchema = mongoose.Schema({
    type: {
        type: Number,
        required: true
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

export default mongoose.model("stock_out", StockOutSchema)
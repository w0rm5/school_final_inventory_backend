import mongoose from "mongoose"

const StockOutSchema = mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    ref: {
        type: mongoose.Types.ObjectId
    },
    remarks: {
        type: String,
        default: ''
    }
},
{
    versionKey: false
})

export default mongoose.model("stock_out", StockOutSchema)
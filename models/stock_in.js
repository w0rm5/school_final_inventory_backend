import mongoose from "mongoose"

const StockInSchema = mongoose.Schema({
    attachments: {
        type: Array,
        default: []
    },
    remarks: {
        type: String,
        default: ''
    }
},
{
    versionKey: false
})

export default mongoose.model("stock_in", StockInSchema)
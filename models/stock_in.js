import mongoose from "mongoose"

const StockInSchema = mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplier',
        required: true
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
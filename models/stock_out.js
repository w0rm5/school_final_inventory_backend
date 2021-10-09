import mongoose from "mongoose"
import { stockOutTypes } from "../utils/enum.js";

const StockOutSchema = mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    remarks: {
        type: String,
        required: function() {
            return this.type != stockOutTypes.SALE;
        },
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
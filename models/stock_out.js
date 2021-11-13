import mongoose from "mongoose"
import { stockOutTypes } from "../utils/enum.js";

const StockOutSchema = mongoose.Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    type: {
        type: Number,
        required: true
    },
    transaction_no: {
        type: String,
        unique: true,
        sparse: true,
        required: function () {
          return this.type == stockOutTypes.SALE;
        },
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
    total_amount: {
        type: Number,
        required: true
    }
},
{
    versionKey: false
})

export default mongoose.model("stock_out", StockOutSchema)
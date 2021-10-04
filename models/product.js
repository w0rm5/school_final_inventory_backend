import mongoose from "mongoose"

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    barcode: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    images: {
        type: Array,
        default: []
    },
    discontinued: {
        type: Boolean,
        default: false
    },
    cost_history: { //from stock in
        type: Array,
        default: [
            /*{
                stock_in: ObjectId,
                cost: Number
                remaining_qty: Number
            }*/
        ]
    },
    sale_price_history: {
        type: Array,
        default: [
            /*{
                change_date: Date,
                old_price: Number
            }*/
        ]
    },
    current_quantity: {
        type: Number,
        default: 0
    },
    current_sale_price: {
        type: Number,
        min: 0,
        required: true
    }
},
{
    versionKey: false
})

export default mongoose.model("product", ProductSchema)

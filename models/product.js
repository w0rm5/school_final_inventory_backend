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
        default: []
    },
    sale_price_history: {
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

export default mongoose.model("product", ProductSchema)

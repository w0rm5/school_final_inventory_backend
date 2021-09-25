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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    images: {
        type: Array,
        default: []
    },
},
{
    versionKey: false
})

export default mongoose.model("product", ProductSchema)
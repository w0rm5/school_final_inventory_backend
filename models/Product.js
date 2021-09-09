import mongoose from "mongoose"
import Category from "./category.js"

const ProductSchema = mongoose.Schema({
    name: {
        type: String
    }
},
{
    versionKey: false
})
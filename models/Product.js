import mongoose from "mongoose"
import Category from "../models/Category.js"

const ProductSchema = mongoose.Schema({
    name: {
        type: String
    }
},
{
    versionKey: false
})
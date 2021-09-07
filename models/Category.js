import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
},
{
    versionKey: false
})

export default mongoose.model("category", CategorySchema)
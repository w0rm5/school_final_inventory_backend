import mongoose from "mongoose"

const SupplierSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
},
{
    versionKey: false
})

export default mongoose.model("supplier", SupplierSchema)
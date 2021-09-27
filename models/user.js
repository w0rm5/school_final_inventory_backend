import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    sex: {
        type: Number,
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String
    },
},
{
    versionKey: false
})

export default mongoose.model("user", UserSchema)
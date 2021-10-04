import mongoose from "mongoose";

const RequestLogSchema = new mongoose.Schema({
    url: String,
    method: String,
    headers: Object,
    body: Object,
    userInfo: Object
},
{
    versionKey: false
})

export default mongoose.model("request_log", RequestLogSchema)
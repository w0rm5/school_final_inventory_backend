import mongoose from "mongoose";

const RequestLogSchema = new mongoose.Schema({
    url: String,
    method: String,
    headers: Object,
    params: Object,
    query: Object,
    body: Object,
    userInfo: Object
},
{
    versionKey: false
})

export default mongoose.model("request_log", RequestLogSchema)
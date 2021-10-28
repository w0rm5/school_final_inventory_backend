import { meta } from "../utils/enum.js";

export async function singleUpload(req, res) {
    try {
        console.log(req.file);
        res.status(meta.OK).json({ meta: meta.OK, file: req.file })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
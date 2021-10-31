import { meta } from "../utils/enum.js";
import { uploadGfs } from "../utils/upload.js"

export async function singleUpload(req, res) {
    try {
        res.status(meta.OK).json({ meta: meta.OK, file: req.file })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function multiUpload(req, res) {
    try {
        res.status(meta.OK).json({ meta: meta.OK, files: req.files })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}

export async function getFile(req, res) {
    try {
        uploadGfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message })
                return
            }
            if (!file) {
                res.status(meta.NOT_FOUND).json({ meta: meta.NOT_FOUND, message: "File not found" })
                return
            }
            const rs = uploadGfs.createReadStream({ filename: file.filename })
            rs.pipe(res)
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}


export async function deleteFile(req, res) {
    try {
        let option = { filename: req.params.filename, root: "file" }
        uploadGfs.exist(option, (err, found) => {
            if (err) {
                res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: err.message })
                return
            }
            if (!found) {
                res.status(meta.NOT_FOUND).json({ meta: meta.NOT_FOUND, message: "File not found" })
                return
            }
            uploadGfs.remove(option, (errRemove) => {
                if (errRemove) {
                    res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: errRemove.message })
                    return
                }
                res.status(meta.OK).json({ meta: meta.OK, message: "File deleted" })
            })
        })
    } catch (error) {
        res.status(meta.INTERNAL_ERROR).json({ meta: meta.INTERNAL_ERROR, message: error.message })
    }
}
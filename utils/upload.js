import crypto from "crypto";
import path from "path";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

const conn = mongoose.createConnection(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })

var gfs

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection("file")
})

const storage = new GridFsStorage({
  url: process.env.DB,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'application/pdf') {
            return reject("File must be in JPG or PNG format (for images) or PDF format (for documents).");
          } else {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                  return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                  filename: filename,
                  bucketName: "file",
                };
                resolve(fileInfo);
              });
          }
      
    });
  },
});

const upload = multer({ storage })

export { upload, gfs as uploadGfs }
import crypto from "crypto";
import path from "path";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";

const storage = new GridFsStorage({
  url: process.env.DB,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            return reject("Image must be in JPG or PNG format.");
          } else {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                  return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                  filename: filename,
                  bucketName: "uploads",
                };
                resolve(fileInfo);
              });
          }
      
    });
  },
});

export const upload = multer({ storage })
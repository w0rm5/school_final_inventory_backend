import express from "express";
import mongoose from "mongoose"
import cors from "cors"
import "dotenv/config";

import { login } from "./controllers/user.js";
import { verifyToken, checkIfAdmin } from "./middlewares/auth.js";
import { logRequests } from "./middlewares/logs.js";
import category from "./routers/category.js";
import supplier from "./routers/supplier.js";
import product from "./routers/product.js";
import user from "./routers/user.js";
import stock_in from "./routers/stock_in.js";
import stock_out from "./routers/stock_out.js";
import upload from "./routers/upload.js";

const app = express();
const port = process.env.PORT || process.env.API_PORT;
const dbConString = process.env.DB;
const corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:8081'],
    optionsSuccessStatus: 200
}

const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, }

mongoose.connect(dbConString, options, (err) => {
    if (err) {
        console.log("mongoose connection error: ", err);
        return
    }

    app.use(cors(corsOptions))
    app.use(express.json());

    app.post("/login", logRequests, login)
    app.use("/user", verifyToken, logRequests, user)
    app.use("/category", verifyToken, logRequests, checkIfAdmin, category)
    app.use("/supplier", verifyToken, logRequests, checkIfAdmin, supplier)
    app.use("/product", verifyToken, logRequests, product)
    app.use("/stock-in", verifyToken, logRequests, stock_in)
    app.use("/stock-out", verifyToken, logRequests, stock_out)
    app.use("/file", logRequests, upload)
    app.listen(port, () => {
        console.log(`app listening at http://localhost:${port}`);
    })
})


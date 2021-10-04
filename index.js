import express from "express";
import mongoose from "mongoose"
import "dotenv/config";

import { login } from "./controllers/user.js";
import { verifyToken, checkIfAdmin } from "./middlewares/auth.js";
import { logRequests } from "./middlewares/logs.js";
import category from "./routers/category.js";
import supplier from "./routers/supplier.js";
import product from "./routers/product.js";
import user from "./routers/user.js";
import stock_in from "./routers/stock_in.js";

const app = express();
const port = process.env.PORT || process.env.API_PORT;
const dbConString = process.env.DB;

// const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, }

mongoose.connect(dbConString, (err) => {
    if (err) {
        console.log("mongoose connection error: ", err);
        return
    }

    app.use(express.json());

    // app.get('/', verifyToken, checkIfAdmin, (req, res) => { //testing
    //     res.status(200).json({ message: 'Hello world' })
    // })

    app.post("/login", logRequests, login)
    app.use("/user", verifyToken, logRequests, user)
    app.use("/category", verifyToken, logRequests, checkIfAdmin, category)
    app.use("/supplier", verifyToken, logRequests, checkIfAdmin, supplier)
    app.use("/product", verifyToken, logRequests, product)
    app.use("/stock_in", verifyToken, logRequests, stock_in)
    app.listen(port, () => {
        console.log(`app listening at http://localhost:${port}`);
    })
})


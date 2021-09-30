import express from "express";
import mongoose from "mongoose"
import "dotenv/config";

import category from "./routers/category.js";
import product from "./routers/product.js";
import user from "./routers/user.js";
import { login } from "./controllers/user.js";

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

    app.get('/', (req, res) => {
        res.status(200).json({ message: 'Hello' })
    })

    app.post("/login", login)
    app.use("/user", user)
    app.use("/category", category)
    app.use("/product", product)
    app.listen(port, () => {
        console.log(`app listening at http://localhost:${port}`);
    })
})


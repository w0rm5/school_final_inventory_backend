import express from "express";
import mongoose from "mongoose"
import "dotenv/config";

import category from "./routers/category.js";
import product from "./routers/product.js";

const app = express();
const port = process.env.PORT || 3000;
const dbConString = process.env.DB;

// const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, }

mongoose.connect(dbConString, (err) => {
    if (err) {
        console.log("mongoose connection error: ", err);
        return
    }

    app.use(express.json());

    // app.get('/', (req, res) => {
    //     res.status(200).json({ message: 'Hello' })
    // })

    app.use("/category", category)
    app.use("/product", product)
    app.listen(port, () => {
        console.log(`app listening at http://localhost:${port}`);
    })
})


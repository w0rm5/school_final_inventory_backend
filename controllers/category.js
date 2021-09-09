import Category from "../models/category.js";
import { meta } from "../utils/enum.js";
import mongoose from "mongoose";

export async function listCategory(req, res) {
    try {
        let data = await Category.find({})
        res.status(200).json({ meta: meta.OK, data: data });
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}

export async function upsertCategory(req, res) {
    try {
        let category = req.body
        console.log(req);
        Category.findOneAndUpdate({ _id: category._id || new mongoose.Types.ObjectId() }, category, { upsert: true, new: true }, (err, doc) => {
            if (err) {
                res.status(400).json({ meta: meta.ERROR, message: err.message });
                return;
            }
            res.status(200).json({ meta: meta.OK, data: doc });
        })
    } catch (error) {
        res.status(500).json({ meta: meta.ERROR, message: error.message })
    }
}
import express from "express";

const app = express();
const port = process.env.PORT || 3000;
const dbConString = 'mongodb+srv://kimpiv:ivtr.mongo@cluster0.jt8vy.mongodb.net/inventoryControl?retryWrites=true&w=majority';

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello' })
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
})
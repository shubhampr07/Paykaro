const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors");
const mainRouter = require("./routes/index");


const app = express();
app.use(express.json());
app.use(cors());
const PORT=8000;
dotenv.config();


app.use("/api/v1", mainRouter);

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("Connected to DB")
    } catch (err) {
        console.log("Error while Connectiong db", err);
    }
}


app.get("/", async (req, res) => {
    res.json("Hello from paytm backend.");
})

app.listen(PORT, () => {
    connectDb()
    console.log(`Server is running on port ${PORT}.`);
})


//AgR2XdXpQwvf9Z9k
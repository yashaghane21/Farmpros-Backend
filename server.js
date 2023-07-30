const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors= require("cors")
const u = require("./Models/Users")
const buyer = require("./Routers/Buyer")
const farmer =require("./Routers/Farmer")
const cron = require('node-cron');
const cleanupOutdatedProducts = require('./Routers/Cleanp');

app.use(express.json());
app.use(cors());


app.use("/api/v1",buyer)
app.use("/api/v2",farmer)
mongoose.set('strictQuery', false);
var mongoDB = "mongodb+srv://bytedevs2121:42UH3cGJrEr57tt8@cluster0.6ozrtkz.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("coonection succsess");
}).catch((e) => {
    console.log(e);
});

cron.schedule('0 0 * * *', () => {
    cleanupOutdatedProducts();
  });

app.listen(5000, () => {
    console.log("jii");
})
const mongoose = require("mongoose");
const orderschema = new mongoose.Schema({
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    Buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    Status:{
        type:String,
        default:"not process"
    }
});

const user = mongoose.model("order", orderschema);
module.exports = user;

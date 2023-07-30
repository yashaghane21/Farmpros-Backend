const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    }, username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },

    city: {
        type: String,
        required: true
    },
    phone:{
        type:Number,
        required:true
    },
    role: {
        type: Number,
        required: true
    }
});

const user = mongoose.model("user", userschema);
module.exports = user;

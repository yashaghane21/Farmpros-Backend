// product.js

const mongoose = require("mongoose");

const bidschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  bidamount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const productmodel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  starttime: {
    type: Date,
    default: Date.now,
  },
  endtime: {
    type: Date,
    required:true
  },
  currenthighestbid: {
    type: Number,
    default:0
   
  },
  sellerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  soldto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },
  bids: [bidschema],
});

const Product = mongoose.model("Product", productmodel);

module.exports = Product;

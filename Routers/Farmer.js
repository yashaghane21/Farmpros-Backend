const express = require("express")
const router = express.Router();
const productmodel = require("../Models/ProductModel")
const ordermodel = require("../Models/Ordermodel")
const usermodel = require("../Models/Users")

router.post("/bidd", async (req, res) => {
    try {
        const { name, desc, image, price, endtime, sellerid } = req.body
        const product = new productmodel({ name, description: desc, image, price, endtime: endtime, sellerid: sellerid });
        await product.save();
        return res.status(200).send({
            success: true,
            message: "done"
        })
    } catch (error) {
        console.log(error)
    }

});

router.get("/getp", async (req, res) => {
    const { id } = req.query;
    const myp = await productmodel.find({ sellerid: id }).populate("bids.user").populate("sellerid");
    return res.status(200).send({
        success: true,
        message: "done",
        myp
    })
})




router.post("/order", async (req, res) => {
    const { Product, Buyer, seller } = req.body;
    const order = new ordermodel({ Product, Buyer, seller });
    await order.save();
    return res.status(200).send({
        success: true,
        message: "order done",
        order
    })
});


router.get("/orders", async (req, res) => {
    const { id } = req.query
    const orders = await ordermodel.find({ seller: id }).populate("Product").populate("Buyer").populate("seller")
    return res.status(200).send({
        success: true,
        message: "Orders of buyer succesfullly fetched",
        orders
    })
})


router.put("/updateo/:oid", async (req, res) => {
    const { oid } = req.params
    const { Status } = req.body
    const orders = await ordermodel.findByIdAndUpdate(oid, { Status }, { new: true });
    return res.status(200).send({
        success:true,
        message:"done",
        orders
    })
})



router.get("/profile/:id",async(req,res)=>{
    const {id}=req.params;
    const user=await usermodel.findById(id);
    return res.status(200).send({
        success:true,
        message:"done",
        user
    })
})

module.exports = router
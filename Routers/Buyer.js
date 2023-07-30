const express = require("express")
const router = express.Router();
const jwt = require("jsonwebtoken")
const JWT_SECRET = "yashaghane"
const usermodel = require("../Models/Users")
const validator = require("validator")
const bcrypt = require("bcrypt")
const productmodel = require("../Models/ProductModel")
const ordermodel =require("../Models/Ordermodel")

router.post("/register", async (req, res) => {                                // http://localhost:5000/api/v3/register
    const { name, email, username, password, city,phone, role } = req.body
    const suser = await usermodel.findOne({ email })
    if (!validator.isEmail(email) || !validator.isLength(phone,{min:10,max:10}) || !validator.isLength(email, { min: 3, max: 320 })) {
        return res.status(400).send({
            success: false,
            message: "Invalid email"
        });
    }
    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).send({
            success: false,
            message: "password shoul be at least 6 digits"
        });
    }

    if (suser) {
        return res.status(400).send({
            success: false,
            message: "user already exist"
        })
    }
    else {
        const hashedpass = await bcrypt.hash(password, 10)
        const user = new usermodel({ name, email, username, password: hashedpass, city,phone, role });
        const userd = await user.save();
        return res.status(200).send({
            success: true,
            message: "done",
            user: userd,

        })
    }



});


router.post("/login", async (req, res) => {               // http://localhost:5000/api/v3/login
    try {
        const { password, email } = req.body;
        //validation
        if (!password | !email) {
            return res.status(401).send({
                success: false,
                message: "Please provide  password",
            });
        }
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "email is not registerd",
            });
        }
        //password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invlid email  or password",
            });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d"
        });
        return res.status(200).send({
            success: true,
            messgae: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                password: user.password,
                city: user.city,
                phone:user.phone,
                role: user.role
            },
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Login Callcback",
            error,
        });
    }
}
);


router.get("/products", async (req, res) => {
    const products = await productmodel.find({}).populate("sellerid");
    return res.status(200).send({
        message: "done",
        success: true,
        products
    });
});

router.get("/product/:id", async (req, res) => {
    const { id } = req.params;
    const product = await productmodel.findById(id).populate("sellerid").populate("bids.user");

 
    const currentTime = new Date();
    const endTime = new Date(product?.endtime);

    if (currentTime > endTime) {
        return res.status(400).send({
            success: false,
            message: "Bidding has closed for this product.",
            product: null,
        });
    }

    return res.status(200).send({
        success: true,
        message: "Done",
        product,
    });
});

router.post("/addbidd", async (req, res) => {
    const { product, bidamount, user } = req.body;
    const fproduct = await productmodel.findById(product);

    if (!fproduct) {
        return res.status(404).send({
            success: false,
            message: "Product not found.",
        });
    }
    if(bidamount < fproduct.price){
        return res.status(400).send({
            success:false,
            message:"Bidding price should greater than base price"
        })
    }

    const currenttime = new Date();
    if(currenttime < fproduct.starttime || currenttime > fproduct.endtime){
        
        return res.status(400).send({
            success:true,
            message:"biding for this product is closed"
        })
    }
   
    const data = {
        user: user,
        bidamount: bidamount,
        fproduct
    };


    fproduct.bids.push(data);

    fproduct.bids.sort((a, b) => b.bidamount - a.bidamount);

    const highestbid = fproduct.bids[0].bidamount;

    console.log("fproduct.bids:", fproduct.bids);
    console.log("highestbid:", highestbid);
    console.log("bidamount:", bidamount);
    console.log("highestbid:", highestbid);

    fproduct.currenthighestbid = highestbid;


    await fproduct.save();

    console.log("fproduct after save:", fproduct); // Check if fproduct is updated correctly

    return res.status(200).send({
        success: true,
        message: "done",
        fproduct,
    });
});


router.get("/orders",async(req,res)=>{
    const {id}=req.query
    const orders= await ordermodel.find({Buyer:id}).populate("Product").populate("Buyer").populate("seller")
    return res.status(200).send({
        success:true,
        message:"Orders of buyer succesfullly fetched",
        orders
    })
 })

module.exports = router;

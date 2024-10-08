const express=require("express");
const { addToCart, fetchCart, removeFromCart }=require("../controllers/cartController");

const router=express.Router();

router.put("/addToCart/:itemId", addToCart);
router.put("/removeFromCart/:itemId", removeFromCart);
router.get("/fetchCart", fetchCart);

module.exports=router;

const express=require("express");
const { addToCart, fetchCart, removeFromCart, inCart }=require("../controllers/cartController");

const router=express.Router();

router.get("/inCart/:itemId", inCart);
router.put("/addToCart/:itemId", addToCart);
router.put("/removeFromCart/:itemId", removeFromCart);
router.get("/fetchCart", fetchCart);

module.exports=router;

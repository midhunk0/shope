const express=require("express");
const { makeOrder, fetchOrders, fetchOrder, addRatingAndReview }=require("../controllers/orderController");

const router=express.Router();

router.post("/makeOrder", makeOrder);
router.get("/fetchOrders", fetchOrders);
router.get("/fetchOrder/:orderId", fetchOrder);
router.get("/canReview/:itemId", addRatingAndReview);

module.exports=router;
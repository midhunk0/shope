const express=require("express");
const { makeOrder, fetchOrders, fetchOrder, addRatingAndReview, fetchOrderItem, updateRatingAndReview }=require("../controllers/orderController");

const router=express.Router();

router.post("/makeOrder", makeOrder);
router.get("/fetchOrders", fetchOrders);
router.get("/fetchOrder/:orderId", fetchOrder);
router.get("/fetchOrderItem/:orderId/:itemId", fetchOrderItem);
router.post("/addRatingAndReview/:itemId", addRatingAndReview);
router.put("/updateRatingAndReview/:itemId", updateRatingAndReview);

module.exports=router;
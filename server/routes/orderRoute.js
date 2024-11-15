const express=require("express");
const { makeOrder, fetchOrders }=require("../controllers/orderController");

const router=express.Router();

router.post("/makeOrder", makeOrder);
router.get("/fetchOrders", fetchOrders);

module.exports=router;
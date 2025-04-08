const express=require("express");
const { fetchDeliveryOrders }=require("../controllers/deliveryController");

const router=express.Router();

router.get("/fetchDeliveryOrders", fetchDeliveryOrders);

module.exports=router;
const express=require("express");
const { fetchDeliveryOrders, deliverOrder }=require("../controllers/deliveryController");

const router=express.Router();

router.get("/fetchDeliveryOrders", fetchDeliveryOrders);
router.put("/deliverOrder/:orderId/:userId", deliverOrder);

module.exports=router;
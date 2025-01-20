const express=require("express");
const { 
    fetchUsers, 
    fetchSellers, 
    fetchCustomers, 
    toggleVerifyUser, 
    toggleVerifyItem, 
    fetchOrders, 
    fetchUser, 
    fetchDeliveryAgents, 
    fetchItems,
    fetchItem,
    fetchOrder
} = require("../controllers/adminController");
const router=express.Router();

router.get("/fetchUsers", fetchUsers);
router.get("/fetchUser/:userId", fetchUser);
router.get("/fetchSellers", fetchSellers);
router.get("/fetchCustomers", fetchCustomers);
router.get("/fetchDeliveryAgents", fetchDeliveryAgents);
router.put("/toggleVerifyUser/:userId", toggleVerifyUser);
router.get("/fetchItems", fetchItems);
router.get("/fetchItem/:itemId", fetchItem);
router.put("/toggleVerifyItem/:userId/:itemId", toggleVerifyItem);
router.get("/fetchOrders", fetchOrders);
router.get("/fetchOrder/:userId/:orderId", fetchOrder);

module.exports=router;
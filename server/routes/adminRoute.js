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
    fetchOrder,
    usersCount,
    ordersPerMonth,
    changeOrderStatus,
    assignDeliveryAgent,
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
router.put("/toggleVerifyItem/:sellerId/:itemId", toggleVerifyItem);
router.get("/fetchOrders", fetchOrders);
router.get("/fetchOrder/:customerId/:orderId", fetchOrder);
router.get("/usersCount", usersCount);
router.get("/ordersPerMonth", ordersPerMonth);
router.put("/changeOrderStatus/:customerId/:orderId", changeOrderStatus);
router.post("/assignDeliveryAgent/:customerId/:orderId/:deliveryAgentId", assignDeliveryAgent);

module.exports=router;
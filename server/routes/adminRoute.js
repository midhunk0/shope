const express=require("express");
const { 
    fetchUsers, 
    fetchSellers, 
    fetchCustomers, 
    toggleVerifyUser, 
    toggleVerifyItem, 
    fetchTransactions, 
    fetchUser, 
    fetchDeliveryAgents 
} = require("../controllers/adminController");
const router=express.Router();

router.get("/fetchUsers", fetchUsers);
router.get("/fetchUser/:userId", fetchUser);
router.get("/fetchSellers", fetchSellers);
router.get("/fetchCustomers", fetchCustomers);
router.get("/fetchDeliveryAgents", fetchDeliveryAgents);
router.put("/toggleVerifyUser/:userId", toggleVerifyUser);
router.put("/toggleVerifyItem/:userId/:itemId", toggleVerifyItem);
router.get("/fetchTransactions", fetchTransactions);

module.exports=router;
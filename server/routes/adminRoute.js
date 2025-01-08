const express=require("express");
const { getUsers, fetchSellers, fetchCustomers, toggleVerifyUser, toggleVerifyItem } = require("../controllers/adminController");
const router=express.Router();

router.get("/getUsers", getUsers);
router.get("/fetchSellers", fetchSellers);
router.get("/fetchCustomers", fetchCustomers);
router.put("/toggleVerifyUser/:userId", toggleVerifyUser);
router.put("/toggleVerifyItem/:userId/:itemId", toggleVerifyItem);

module.exports=router;
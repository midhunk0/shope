// @ts-nocheck
const express=require("express");
const { createSellItem, deleteSellItem, fetchSellItem, fetchSellItems, updateSellItem, fetchTransactions }=require("../controllers/sellController");
const upload=require("../config/uploadConfig");

const router=express.Router();

router.post("/createSellItem", upload.array("images"), createSellItem);
router.get("/fetchSellItems", fetchSellItems);
router.get("/fetchSellItem/:itemId", fetchSellItem);
router.put("/updateSellItem/:itemId", updateSellItem);
router.delete("/deleteSellItem/:itemId", deleteSellItem);
router.get("/fetchTransactions", fetchTransactions);

module.exports=router;

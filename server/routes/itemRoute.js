const express=require("express");
const { fetchImage, fetchItem, fetchItems }=require("../controllers/itemController");

const router=express.Router();

router.get("/fetchItems", fetchItems);
router.get("/fetchImage/:id/:imageIndex", fetchImage);
router.get("/fetchItem/:itemId", fetchItem);

module.exports=router;

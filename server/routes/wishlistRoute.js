const express=require("express");
const { fetchWishlist, toggleWishlist }=require("../controllers/wishlistController");

const router=express.Router();

router.put("/toggleWishlist/:itemId", toggleWishlist);
router.get("/fetchWishlist", fetchWishlist);

module.exports=router;

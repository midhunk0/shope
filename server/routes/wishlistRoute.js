const express=require("express");
const { fetchWishlist, toggleWishlist, inWishlist }=require("../controllers/wishlistController");

const router=express.Router();

router.get("/inWishlist/:itemId", inWishlist);
router.put("/toggleWishlist/:itemId", toggleWishlist);
router.get("/fetchWishlist", fetchWishlist);

module.exports=router;

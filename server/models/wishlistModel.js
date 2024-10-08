const mongoose=require("mongoose");

const wishlistSchema=new mongoose.Schema({
    userId: {
        type: String,
        reqruied: true
    },
    itemIds: {
        type: [],
        required: true
    }
})

const Wishlist=mongoose.model("Wishlist", wishlistSchema);

module.exports=Wishlist;

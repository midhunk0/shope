const mongoose=require("mongoose");

const wishlistSchema=new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    itemIds: {
        type: [String],
        required: true
    }
}, { timestamps: true });

const Wishlist=mongoose.model("Wishlist", wishlistSchema);

module.exports=Wishlist;



const Wishlist=require("../models/wishlistModel");
const User=require("../models/userModel");
const Item=require("../models/itemModel");
const { returnUserId }=require("../helpers/authHelper");

const inWishlist=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const { itemId }=req.params;
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const wishlist=await Wishlist.findOne({ customerId: customerId });
        if(!wishlist){
            return res.status(400).json({ message: "No wishlist found" });
        }
        const isIn=wishlist.itemIds.includes(itemId);
        return res.status(200).json({ liked: isIn });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const toggleWishlist=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const { itemId }=req.params;
        const item=await Item.findById(itemId);
        if(!item){
            return res.status(400).json({ message: "No item found" });
        }
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const wishlist=await Wishlist.findOne({ customerId: customerId });
        if(!wishlist){
            return res.status(400).json({ message: "No wishlist found" });
        }   
        else{
            let message;
            const itemExist=wishlist.itemIds.includes(itemId);
            if(!itemExist){
                wishlist.itemIds.push(itemId);
                message="Item added to wishlist";
            }
            else{
                const index=wishlist.itemIds.findIndex(itemId=>itemId===itemId);
                if(index!==-1){
                    wishlist.itemIds.splice(index, 1);
                    message="Item removed from wishlist";
                }
            }
            await wishlist.save();
            return res.status(200).json({ liked: !itemExist, message: message });
        }
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchWishlist=async(req, res)=>{
    try{
        const apiUrl=process.env.API_URL;
        const customerId=await returnUserId(req, res);
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const wishlist=await Wishlist.findOne({ customerId: customerId });
        if(!wishlist){
            return res.status(400).json({ message: "No wishlist found" });
        }
        const wishlistItems=await Promise.all(
            wishlist.itemIds.map(async(itemId)=>{
                const wishlistItem=await Item.findById(itemId);
                if(wishlistItem){
                    const imageUrls=wishlistItem.images.map((_, index)=>`${apiUrl}/fetchImage/${itemId}/${index}`);
                    const rating=wishlistItem.ratings.length>0 ? wishlistItem.ratings.reduce((sum, rating)=>sum+rating.rating, 0)/wishlistItem.ratings.length : 0;
                    const { images, ratings, ...itemWithImages }=wishlistItem.toObject();
                    return{
                        ...itemWithImages,
                        imageUrls, 
                        rating
                    };        
                }
            })
        )
        return res.status(200).json(wishlistItems);
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports={
    inWishlist,
    toggleWishlist, 
    fetchWishlist
}
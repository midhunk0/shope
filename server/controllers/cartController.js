// @ts-nocheck
const Cart=require("../models/cartModel");
const User=require("../models/authModel");
const Item=require("../models/itemModel");
const { returnUserId }=require("../helpers/authHelper");

const addToCart=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        const { itemId }=req.params;
        const item=await Item.findById(itemId);
        if(!item){
            return res.status(400).json({ message: "No item found" });
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const cart=await Cart.findOne({ userId: userId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const index=cart.itemIds.indexOf(itemId);
        if(index===-1){
            cart.itemIds.push(itemId);
        }
        else{
            return res.status(400).json({ message: "Item already in the cart" });
        }
        await cart.save();
        return res.status(200).json({ message: "Item added to the cart" });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const removeFromCart=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        const { itemId }=req.params;
        const item=await Item.findById(itemId);
        if(!item){
            return res.status(400).json({ message: "No item found" });
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const cart=await Cart.findOne({ userId: userId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const index=cart.itemIds.indexOf(itemId);
        if(index!==-1){
            cart.itemIds.splice(index, 1);
        }
        else{
            return res.status(400).json({ message: "Item is not present in the cart" });
        }
        await cart.save();
        return res.status(200).json({ message: "Item removed from the cart" });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchCart=async(req, res)=>{
    try{
        const apiUrl=process.env.API_URL;
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const cart=await Cart.findOne({ userId: userId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const cartItems=await Promise.all(
            cart.itemIds.map(async (id)=>{
                const cartItem=await Item.findById(id);
                if(cartItem){
                    const imageUrls=cartItem.images.map((_, index)=>`${apiUrl}/fetchImage/${id}/${index}`);
                    return{
                        ...cartItem.toObject(),
                        imageUrls
                    }
                }
            })
        )
        return res.status(200).json(cartItems)
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports={
    addToCart,
    removeFromCart,
    fetchCart
}
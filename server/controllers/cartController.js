// @ts-nocheck
const Cart=require("../models/cartModel");
const User=require("../models/userModel");
const Item=require("../models/itemModel");
const { returnUserId }=require("../helpers/authHelper");

const inCart=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const { itemId }=req.params;
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const cart=await Cart.findOne({ customerId: customerId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const isIn=cart.items.some(item=>item.itemId===itemId);
        return res.status(200).json({ cart: isIn });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const addToCart=async(req, res)=>{
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
        const cart=await Cart.findOne({ customerId: customerId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const itemExists=cart.items.find(cartItem=>cartItem.itemId.toString()===itemId);
        if(itemExists){
            return res.status(400).json({ message: "Item already in the cart" });
        }
        const count=1;
        cart.items.push({ itemId, count });
        cart.cost+=item.price;

        await cart.save();
        return res.status(200).json({ message: "Item added to the cart" });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const removeFromCart=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const { itemId }=req.params;
        const item=await Item.findById(itemId);
        if(!item){
            return res.status(400).json({ message: "No item found" });
        }
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "User not found" });
        }
        const cart=await Cart.findOne({ customerId: customerId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const index=cart.items.findIndex(item=>item.itemId===itemId);
        if(index!==-1){
            cart.cost-=item.price*cart.items[index].count;
            cart.items.splice(index, 1);
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

const changeCount=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const { itemId, op }=req.body;
        const cart=await Cart.findOne({ customerId: customerId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const item=cart.items.find(item=>item.itemId===itemId);
        if(!item){
            return res.status(400).json({ message: "Item not found" })
        }
        const itemDetails=await Item.findById(itemId);
        if(op==="+" && item.count<=itemDetails.pieceLeft){
            item.count+=1;
            cart.cost+=itemDetails.price;
        }
        else if(op==="-" && item.count>1){
            item.count-=1;
            cart.cost-=itemDetails.price;
        }
        else{}
        await cart.save();
        return res.status(200).json(cart);
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchCart=async(req, res)=>{
    try{
        const apiUrl=process.env.API_URL;
        const customerId=await returnUserId(req, res);
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const cart=await Cart.findOne({ customerId: customerId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const cartItems=await Promise.all(
            cart.items.map(async (item)=>{
                const cartItem=await Item.findById(item.itemId);
                if(cartItem){
                    // const imageUrls=cartItem.images.map((_, index)=>`${apiUrl}/fetchImage/${item.itemId}/${index}`);
                    const rating=cartItem.ratings.length>0 ? cartItem.ratings.reduce((sum, rating)=>sum+rating.rating, 0)/cartItem.ratings.length : 0;
                    const { images, ratings, ...itemWithImages }=cartItem.toObject();
                    return{
                        ...itemWithImages,
                        // imageUrls, 
                        rating,
                        count: item.count
                    };
                }
            })
        )
        return res.status(200).json({ cartItems, cost: cart.cost });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const cartCheckout=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const customer=await User.findById(customerId);
        const { cost }=req.body;
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const cart=await Cart.findOne({ customerId: customerId });
        if(!cart){
            return res.status(400).json({ mesage: "No cart found" });
        }
        return res.status(200).json({ cart, cost: cost });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports={
    inCart,
    addToCart,
    removeFromCart,
    fetchCart,
    cartCheckout,
    changeCount
}
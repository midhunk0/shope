// @ts-nocheck
const Cart=require("../models/cartModel");
const User=require("../models/authModel");
const Orders=require("../models/orderModel");
const Item=require("../models/itemModel");
const Sell=require("../models/sellModel");
const { returnUserId }=require("../helpers/authHelper");

const makeOrder=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const cart=await Cart.findOne({ userId: userId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const order=await Orders.findOne({ userId: userId });
        if(!order){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const shippingAddress=req.body;
        const cartItems=await Promise.all(
            cart.items.map(async (item)=>{
                const cartItem=await Item.findById(item.itemId);
                if(cartItem){
                    const seller=await Sell.findOne({ userId: cartItem.userId });
                    if(seller){
                        seller.transactions.push({
                            customerId: userId,
                            itemId: item.itemId, 
                            count: item.count,
                            status: "pending"
                        });
                        await seller.save()
                    }
                    cartItem.pieceLeft-=item.count;
                    await cartItem.save();
                    return { itemId: item.itemId, count: item.count }
                }
                return null;
            })
        )
        order.orders.push({
            shippingAddress,
            date: new Date(),
            items: cart.items,
            total: cart.cost,
            status: "pending"
        })
        await order.save();
        cart.items.splice(0, cart.items.length);
        cart.cost=0;
        await cart.save();
        return res.status(200).json({ message: "Order successfully placed" });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchOrders=async(req, res)=>{
    try{
        const apiUrl=process.env.API_URL;
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const orders=await Orders.findOne({ userId: userId });
        if(!orders){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const sortedOrders=orders.orders.sort((a, b)=>new Date(b.date) - new Date(a.date));
        const orderDetails=await Promise.all(
            sortedOrders.map(async (order)=>{
                const orderItems=await Promise.all(
                    order.items.map(async (item)=>{
                        const orderItem=await Item.findById(item.itemId);
                        if(orderItem){
                            const imageUrls=orderItem.images.map((_, index)=>`${apiUrl}/fetchImage/${orderItem._id}/${index}`);
                            const rating=orderItem.ratings.length>0 ? orderItem.ratings.reduce((sum, rating)=>sum+rating.rating, 0)/orderItem.ratings.length : 0;
                            const { images, ratings, ...itemWithImages }=orderItem.toObject();
                            return{
                                ...itemWithImages,
                                imageUrls, 
                                rating,
                                count: item.count
                            };
                        }
                    })
                )
                return{
                    date: order.date,
                    items: orderItems,
                    total: order.total,
                    status: order.status,
                    orderId: order._id
                }
            })
        );
        return res.status(200).json(orderDetails);
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchOrder=async(req, res)=>{
    try{
        const apiUrl=process.env.API_URL;
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const orders=await Orders.findOne({ userId: userId });
        if(!orders){
            return res.status(400).json({ message: "Orders list not found" });
        } 
        const { orderId }=req.params;
        const order=orders.orders.find((order)=>order._id.toString()===orderId);
        if(!order){
            return res.status(400).json({ message: "Order not found" });
        }
        const itemDetails=await Promise.all(
            order.items.map(async (item)=>{
                const orderItem=await Item.findById(item.itemId);
                if(orderItem){
                    const imageUrls=orderItem.images.map((_, index)=>`${apiUrl}/fetchImage/${orderItem._id}/${index}`);
                    const rating=orderItem.ratings.length>0 ? orderItem.ratings.reduce((sum, rating)=>sum+rating.rating, 0)/orderItem.ratings.length : 0;
                    const { images, ratings, ...itemWithImages }=orderItem.toObject();
                    return{
                        ...itemWithImages,
                        imageUrls, 
                        rating,
                        count: item.count
                    } 
                }
            })
        )
        const { items, ...orderDetails }=order.toObject();
        return res.status(200).json({ ...orderDetails, itemDetails });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const addRatingAndReview=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { itemId }=req.params;
        const orders=await Orders.findOne({ userId: userId });
        if(!orders){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const eligible=orders.orders.some((order)=>{
            const item=order.items.some((item)=>item.itemId===itemId);
            return item && order.status==="completed";
        })
        if(!eligible){
            return res.status(400).json({ message: "You are not eligible to rate or review this item" });
        }
        const { rating, review }=req.body;
        if(rating>5 || rating<1){
            return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
        }
        const item=await Item.findById(itemId);
        if(!item){
            return res.status(400).json({ message: "Item not found" });
        }
        const ratingPresent=item.ratings.find((rating)=>(rating.customerId===userId));
        if(rating && !ratingPresent){
            item.ratings.push({ rating: rating, customerId: userId });
        }
        const reviewPresent=item.reviews.find((review)=>(review.customerId===userId));
        if(review && !reviewPresent){
            item.reviews.push({ review: review, customerId: userId });
        }
        if(ratingPresent || reviewPresent){
            return res.status(400).json({ message: "You have already added" });
        }
        await item.save();
        return res.status(200).json({ message:  "Ratings and review added successfully"});
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports={
    makeOrder,
    fetchOrders,
    fetchOrder,
    addRatingAndReview
}
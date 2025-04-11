// @ts-nocheck
const Cart=require("../models/cartModel");
const User=require("../models/userModel");
const Order=require("../models/orderModel");
const Item=require("../models/itemModel");
const Sell=require("../models/sellModel");
const { returnUserId }=require("../helpers/authHelper");
const Transaction = require("../models/transactionModel");

const makeOrder=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const cart=await Cart.findOne({ customerId: customerId });
        if(!cart){
            return res.status(400).json({ message: "No cart found" });
        }
        const order=await Order.findOne({ customerId: customerId });
        if(!order){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const shippingAddress=req.body;
        const cartItems=await Promise.all(
            cart.items.map(async (item)=>{
                const cartItem=await Item.findById(item.itemId);
                if(cartItem){
                    const transaction=new Transaction({
                        sellerId: cartItem.sellerId,
                        customerId: customerId,
                        // date: new Date(),
                        itemId: item.itemId, 
                        count: item.count,
                        status: "pending"
                    });
                    await transaction.save();
                    cartItem.pieceLeft-=item.count;
                    await cartItem.save();
                    const seller=await Sell.findOne({ sellerId: cartItem.sellerId });
                    if(seller){
                        seller.transactionIds.push(transaction._id);
                        await seller.save();
                    }
                    return { 
                        itemId: item.itemId, 
                        count: item.count, 
                        transactionId: transaction._id
                    }
                }
                return null;
            })
        )
        order.orders.push({
            shippingAddress,
            // date: new Date(),
            items: cartItems,
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
        const customerId=await returnUserId(req, res);
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const orders=await Order.findOne({ customerId: customerId });
        if(!orders){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const sortedOrders=orders.orders.sort((a, b)=>new Date(b.createdAt) - new Date(a.createdAt));
        const orderDetails=await Promise.all(
            sortedOrders.map(async (order)=>{
                const orderItems=await Promise.all(
                    order.items.map(async (item)=>{
                        const orderItem=await Item.findById(item.itemId);
                        if(orderItem){
                            // const imageUrls=orderItem.images.map((_, index)=>`${apiUrl}/fetchImage/${orderItem._id}/${index}`);
                            const rating=orderItem.ratings.length>0 ? orderItem.ratings.reduce((sum, rating)=>sum+rating.rating, 0)/orderItem.ratings.length : 0;
                            const { images, ratings, ...itemWithImages }=orderItem.toObject();
                            return{
                                ...itemWithImages,
                                // imageUrls, 
                                rating,
                                count: item.count
                            };
                        }
                    })
                )
                return{
                    date: order.createdAt,
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
        const customerId=await returnUserId(req, res);
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "User not found" });
        }
        const orders=await Order.findOne({ customerId: customerId });
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
                    // const imageUrls=orderItem.images.map((_, index)=>`${apiUrl}/fetchImage/${orderItem._id}/${index}`);
                    const rating=orderItem.ratings.length>0 ? orderItem.ratings.reduce((sum, rating)=>sum+rating.rating, 0)/orderItem.ratings.length : 0;
                    const { images, ratings, ...itemWithImages }=orderItem.toObject();
                    return{
                        ...itemWithImages,
                        // imageUrls, 
                        rating,
                        date: item.createdAt,
                        count: item.count,
                        reviewed: item.reviewed
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

const fetchOrderItem=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const customer=await User.findById(customerId);
        const apiUrl=process.env.API_URL;
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const orders=await Order.findOne({ customerId: customerId });
        if(!orders){
            return res.status(400).json({ message: "Order list not found" });
        }
        const { orderId, itemId }=req.params;
        const order=await orders.orders.find(order=>order._id.toString()===orderId);
        if(!order){
            return res.status(400).json({ message: "Order not found" });
        }
        const item=await order.items.find(item=>item.itemId===itemId);
        if(!item){
            return res.status(400).json({ message: "Item not found" });
        }
        const orderItem=await Item.findById(item.itemId);
        const myRating=orderItem?.ratings.find((rating)=>rating.customerId===customerId)?.rating || 0;
        const myReview=orderItem?.reviews.find((review)=>review.customerId===customerId)?.review || "";
        // const imageUrls=orderItem.images.map((_, index)=>`${apiUrl}/fetchImage/${orderItem._id}/${index}`);
        const rating=orderItem.ratings.length>0 ? orderItem.ratings.reduce((sum, rating)=>sum+rating.rating, 0)/orderItem.ratings.length : 0;
        const { images, ratings, reviews, ...itemWithImages }=orderItem.toObject();
        const itemDetails={
            ...itemWithImages,
            // imageUrls, 
            rating,
            myRating, 
            myReview,
            count: item.count,
            reviewed: item.reviewed
        } 
        return res.status(200).json(itemDetails);
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const addRatingAndReview=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const { itemId }=req.params;
        const orders=await Order.findOne({ customerId: customerId });
        if(!orders){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const eligible=orders.orders.some((order)=>{
            const orderItem=order.items.some((item)=>item.itemId===itemId);
            return orderItem && order.status==="completed";
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
        const ratingPresent=item.ratings.find((rating)=>(rating.customerId===customerId));
        if(rating && !ratingPresent){
            item.ratings.push({ rating: rating, customerId: customerId });
        }
        const reviewPresent=item.reviews.find((review)=>(review.customerId===customerId));
        if(review && !reviewPresent){
            item.reviews.push({ review: review, customerId: customerId });
        }
        if(ratingPresent || reviewPresent){
            return res.status(400).json({ message: "You have already added" });
        }
        orders.orders.some((order)=>{
            const item=order.items.find((item)=>{
                if(item.itemId===itemId){
                    item.reviewed=true;
                }
            });
        })
        await orders.save();
        await item.save();
        return res.status(200).json({ message:  "Ratings and review added successfully"});
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const updateRatingAndReview=async(req, res)=>{
    try{
        const customerId=await returnUserId(req, res);
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const { itemId }=req.params;
        const orders=await Order.findOne({ customerId: customerId });
        if(!orders){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const eligible=orders.orders.some((order)=>{
            const orderItem=order.items.some((item)=>item.itemId===itemId);
            return orderItem && order.status==="completed";
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
        const ratingIndex=item.ratings.findIndex((rating)=>(rating.customerId===customerId));
        if(ratingIndex===-1){
            return res.status(400).json({ message: "No rating found" });
        }
        item.ratings[ratingIndex].rating=rating;
        const reviewIndex=item.reviews.findIndex((review)=>(review.customerId===customerId));
        if(reviewIndex===-1){
            return res.status(400).json({ message: "No review found" });
        }
        item.reviews[reviewIndex].review=review;
        await item.save();
        return res.status(200).json({ message: "Ratings and review updated successfully" });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports={
    makeOrder,
    fetchOrders,
    fetchOrder,
    fetchOrderItem,
    addRatingAndReview,
    updateRatingAndReview
}
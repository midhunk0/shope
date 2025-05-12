const { returnUserId }=require("../helpers/authHelper");
const User=require("../models/userModel");
const Delivery=require("../models/deliveryModel");
const Order=require("../models/orderModel");
const Transaction = require("../models/transactionModel");

const fetchDeliveryOrders=async(req, res)=>{
    try{
        const deliveryAgentId=await returnUserId(req, res);
        const deliveryAgent=await User.findById(deliveryAgentId);
        if(!deliveryAgent){
            return res.status(400).json({ message: "Delivery agent not found" });
        }
        const delivery=await Delivery.findOne({ deliveryAgentId });
        if(!delivery){
            return res.status(400).json({ message: "No delivery array found" });
        }
        if(delivery.orders.length===0){
            return res.status(200).json({ message: "No delivery orders found" });
        }
        const orders=await Promise.all(
            delivery.orders.map(async(order)=>{
                const orderDetails=await Order.findOne({ customerId: order.customerId });
                if (!orderDetails) return null;          
                const matchedOrder=orderDetails.orders.find(
                    (o)=>o._id.toString()===order.orderId && o.deliveryAgentId===deliveryAgentId
                );
                const customer=await User.findById(order.customerId);
                const returnOrder={
                    ...matchedOrder?.toObject(),
                    userId: order.customerId,
                    username: customer?.username,
                }
                return returnOrder || null;
            })
        );
        if(!orders){
            return res.status(400).json({ message: "No orders found" });
        }
        return res.status(200).json({ deliveryOrders: orders });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

const deliverOrder=async(req, res)=>{
    try{
        const deliveryAgentId=await returnUserId(req, res);
        const deliveryAgent=await User.findById(deliveryAgentId);
        if(!deliveryAgent){
            return res.status(400).json({ message: "Delivery agent not found" });
        }
        const delivery=await Delivery.findOne({ deliveryAgentId });
        if(!delivery){
            return res.status(400).json({ message: "No delivery array found" });
        }
        if(delivery.orders.length===0){
            return res.status(200).json({ message: "No delivery orders found" });
        }
        const { orderId, userId }=req.params;
        const order=delivery.orders.find((order)=>order.orderId===orderId);
        console.log(orderId);
        if(!order){
            return res.status(400).json({ message: "Order not found" });
        }
        order.status="delivered";
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const orderDetails=await Order.findOne({ customerId: userId });
        if(!orderDetails){
            return res.status(400).json({ message: "Order details not found" });
        }
        const matchedOrder=orderDetails.orders.find((order)=>order._id.toString()===orderId && order.deliveryAgentId===deliveryAgentId);
        if(!matchedOrder){
            return res.status(400).json({ message: "Order not found" });
        }
        matchedOrder.status="delivered";
        matchedOrder.events.push({
            date: new Date(),
            event: "delivered"
        });
        await Promise.all(
            matchedOrder.items.map(async(item)=>{
                const transaction=await Transaction.findOne({ _id: item.transactionId });
                if(!transaction){
                    return res.status(400).json({ message: "Transaction not found" });
                }
                transaction.status="delivered";
                await transaction.save();
            })
        ) 
        await orderDetails.save();
        await delivery.save();
        return res.status(200).json({ message: "Order delivered successfully" });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

module.exports={
    fetchDeliveryOrders,
    deliverOrder
}
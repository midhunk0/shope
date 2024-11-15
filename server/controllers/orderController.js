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
                            count: item.count
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

        // return res.status(200).json(cart);
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchOrders=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const orders=await Orders.findOne({ userId: userId });
        if(!orders){
            return res.status(400).json({ message: "Orders list not found" });
        }
        return res.status(200).json(
            orders.orders.map(order =>({
                date: order.date,
                items: order.items,
                total: order.total,
                status: order.status
            }))
        );
            }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports={
    makeOrder,
    fetchOrders
}
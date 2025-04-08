// @ts-nocheck
const { returnUserId }=require("../helpers/authHelper");
const User=require("../models/userModel");
const Item=require("../models/itemModel");
const Order=require("../models/orderModel");
const Delivery=require("../models/deliveryModel");

const fetchUsers=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" })
        }
        const users=await User.find({ role: { $ne: "admin" } }).select("name username email role verified").sort({ createdAt: -1 });
        if(!users.length){
            return res.status(400).json({ message: "No users" });
        }
        return res.status(200).json({ message: "Users fetched", users: users });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchUser=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const { userId }=req.params;
        const user=await User.findById(userId).select("name username email role verified");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User fetched", user });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchSellers=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const sellers=await User.find({ role: "seller"}).select("name username email role verified");
        if(!sellers.length){
            return res.status(400).json({ message: "there is no sellers" });
        }
        return res.status(200).json({ message: "Sellers fetched", sellers: sellers });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchCustomers=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const customers=await User.find({ role: "customer" }).select("name username email role verified");
        if(!customers.length){
            return res.status(400).json({ message: "there is no customers" });
        }
        return res.status(200).json({ message: "customers fetched", customers: customers });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const fetchDeliveryAgents=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const deliveryAgents=await User.find({ role: "delivery" }).select("name username email role verified _id");
        if(deliveryAgents.length===0){
            return res.status(400).json({ message: "there is no delivery agents" });
        }
        return res.status(200).json({ message: "delivery agents fetched", deliveryAgents: deliveryAgents });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const toggleVerifyUser=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const { userId }=req.params;
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        user.verified=!user.verified;
        await user.save();
        return res.status(200).json({ message: `User ${!user.verified ? "not verified" : "verified"}`});    
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchItems=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }

        const verifiedSellerIds=await User.find({ verified: true, role: "seller" }).distinct("_id");
        if(!verifiedSellerIds.length){
            return res.status(400).json({ message: "No verified users found" });
        }
        const items=await Item.find({ sellerId: { $in: verifiedSellerIds } }).select("sellerId name type price pieceLeft verified");
        if(!items.length){
            return res.status(400).json({ message: "There are no items" });
        }
        const itemsDetails=await Promise.all(
            items.map(async (item)=>{
                const seller=await User.findById(item.sellerId).select("username");
                return{
                    ...item.toObject(), 
                    username: seller?.username
                }
            })
        )
        return res.status(200).json({ message: "Items are fetched", items: itemsDetails });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
};

const fetchItem=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const apiUrl=process.env.API_URL;
        const { itemId }=req.params;
        const item=await Item.findById(itemId).select("userId name type price pieceLeft verified images");
        if(!item){
            return res.status(400).json({ message: "Item not found" });
        }
        // const imageUrls=item.images.map((_, index)=>`${apiUrl}/fetchImage/${itemId}/${index}`);
        const { images, ...itemData }=item.toObject();
        const seller=await User.findById(item.sellerId);
        const itemWithImages={
            ...itemData,
            // imageUrls,
            username: seller?.username
        }
        return res.status(200).json({ message: "Item fetched", item: itemWithImages});
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
};

const toggleVerifyItem=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const { sellerId }=req.params;
        console.log(req.params);
        const seller=await User.findById(sellerId);
        if(!seller){
            return res.status(400).json({ message: "Seller not found" });
        }
        if(!seller.verified){
            return res.status(400).json({ message: "Seller not verified" });
        }
        const { itemId }=req.params;
        const item=await Item.findById(itemId);
        if(!item){
            return res.status(400).json({ message: "Item not found" });
        }
        item.verified=!item.verified;
        await item.save();
        return res.status(200).json({ message: `Item ${item.verified ? "verified" : "not verified"}`, item: item});
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchOrders=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const allOrders=await Order.find();
        if(!allOrders.length){
            return res.status(400).json({ message: "No orders" });
        }
        const orders=await Promise.all(
            allOrders.map(async (customerOrders)=>{
                const customer=await User.findById(customerOrders.customerId);
                return customerOrders.orders.map((order)=>({
                    ...order.toObject(),
                    username: customer?.username,
                    userId: customer?._id
                }));
            })
        )
        const validOrders=orders.flat();
        return res.status(200).json({ message: "Orders are fetched", orders: validOrders.sort((a, b)=>new Date(b.createdAt) - new Date(a.createdAt))});
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
};

const fetchOrder=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const apiUrl=process.env.API_URL;
        const { customerId, orderId }=req.params;

        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const ordersDetails=await Order.findOne({ customerId: customerId });
        if(!ordersDetails){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const order=ordersDetails.orders.find((order)=>order._id.toString()===orderId);
        if(!order){
            return res.status(400).json({ message: "Order not found" });
        } 
        const itemsDetails=await Promise.all(
            order.items.map(async (item)=>{
                const itemDetails=await Item.findById(item.itemId).select("userId name type price");
                const seller=await User.findOne({ _id:  itemDetails?.sellerId });
                return{
                    ...itemDetails?.toObject(),
                    count: item.count,
                    username: seller?.username
                }
            })
        )
        return res.status(200).json({ message: "Order fetched successfully", items: itemsDetails, username: customer.username, userId: customer._id, orderId: order._id, status: order.status, total: order.total });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
};

const usersCount=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const users=await User.aggregate([{
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }])
        if(!users.length){
            return res.status(400).json({ message: "No users" });
        }
        const usersCountByRole=users.filter(userType=>userType._id!=="admin").map(userType=>({
            role: userType._id,
            count: userType.count
        }))
        return res.status(200).json({ users: usersCountByRole });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
};

const ordersPerMonth = async (req, res) => {
    try {
        const adminId = await returnUserId(req, res);
        if (!adminId) {
            return res.status(400).json({ message: "Admin not logged in" });
        }

        const allOrders = await Order.find();
        if (!allOrders.length) {
            return res.status(400).json({ message: "There are no orders" });
        }

        const orders = allOrders.flatMap((userOrders) =>
            userOrders.orders.map((order) => ({
                createdAt: order.createdAt,
            }))
        );

        // Object to store orders count per month
        const ordersCountPerMonth = {};

        orders.forEach((order) => {
            const date = new Date(order.createdAt);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // Format: YYYY-MM

            ordersCountPerMonth[monthYear] = (ordersCountPerMonth[monthYear] || 0) + 1;
        });

        return res.status(200).json({ ordersPerMonth: ordersCountPerMonth });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const changeOrderStatus=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const { customerId, orderId }=req.params;
        const customer=await User.findById(customerId);
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }
        const ordersDetails=await Order.findOne({ customerId: customerId });
        if(!ordersDetails){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const order=ordersDetails.orders.find((order)=>order._id.toString()===orderId);
        if(!order){
            return res.status(400).json({ message: "Order not found" });
        }
        const { status }=req.body;
        if(!status){
            return res.status(400).json({ message: "Status not provided"});
        }
        order.status=status;
        await ordersDetails.save();
        return res.status(200).json({ message: "Order status updated", status: order.status });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
};

const assignDeliveryAgent=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" });
        }
        const { customerId, orderId, deliveryAgentId}=req.params;
        const deliveryAgent=await Delivery.findOne({  userId: deliveryAgentId });
        if(!deliveryAgent){
            return res.status(400).json({ message: "Delivery agent not found" });
        }
        const ordersDetails=await Order.findOne({ customerId: customerId });
        if(!ordersDetails){
            return res.status(400).json({ message: "Orders list not found" });
        }
        const order=ordersDetails.orders.find((order)=>order._id.toString()===orderId);
        if(!order){
            return res.status(400).json({ message: "Order not found" });
        }
        if(order.deliveryAgentId){
            return res.status(400).json({ message: "Delivery agent already assigned" });
        }
        deliveryAgent.orders.push({ 
            orderId: orderId.toString(), 
            userId: customerId.toString(), 
            status: "shipped" 
        });
        order.deliveryAgentId=deliveryAgentId;
        order.status="shipped";
        await ordersDetails.save();
        await deliveryAgent.save();
        return res.status(200).json({ message: "Delivery agent assigned" });
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

module.exports={
    fetchUsers,
    fetchUser,
    fetchSellers,
    fetchCustomers,
    fetchDeliveryAgents,
    toggleVerifyUser,
    fetchItems,
    fetchItem,
    toggleVerifyItem,
    fetchOrders,
    fetchOrder,
    usersCount,
    ordersPerMonth,
    changeOrderStatus,
    assignDeliveryAgent
}
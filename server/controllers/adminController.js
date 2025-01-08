const { returnUserId } = require("../helpers/authHelper");
const User=require("../models/authModel");
const Item = require("../models/itemModel");

const getUsers=async(req, res)=>{
    try{
        const adminId=await returnUserId(req, res);
        if(!adminId){
            return res.status(400).json({ message: "admin not logged in" })
        }
        const users=await User.find({ role: { $ne: "admin" }});
        if(!users.length){
            return res.status(400).json({ message: "there is no users" });
        }
        return res.status(200).json({ message: "Users fetched", users: users });
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
        const sellers=await User.find({ role: "seller"});
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
        const customers=await User.find({ role: "customer" });
        if(!customers.length){
            return res.status(400).json({ message: "there is no customers" });
        }
        return res.status(200).json({ message: "customers fetched", customers: customers });
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
        return res.status(200).json({ message: `User ${!user.verified ? "not verified" : "verified"}`, user: user});    
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const toggleVerifyItem=async(req, res)=>{
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
        if(!user.verified){
            return res.status(400).json({ message: "User not verified" });
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

module.exports={
    getUsers,
    fetchSellers,
    fetchCustomers,
    toggleVerifyUser,
    toggleVerifyItem
}
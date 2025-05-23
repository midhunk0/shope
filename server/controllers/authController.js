const { comparePassword, generateToken, hashPassword }=require("../config/authConfig");
const User=require("../models/userModel");
const Cart=require("../models/cartModel");
const Wishlist=require("../models/wishlistModel");
const Sell=require("../models/sellModel");
const { returnUserId } = require("../helpers/authHelper");
const Order = require("../models/orderModel");
const Delivery = require("../models/deliveryModel");
const Transaction = require("../models/transactionModel");

const registerUser=async(req, res)=>{
    try{
        const { name, username, email, phone, password, role }=req.body;
        if(!name || !username || !email || !phone || !password){
            return res.status(400).json({ message: "All entries are needed" });
        }
        const usernameExist=await User.findOne({ username });
        if(usernameExist){
            return res.status(400).json({ message: "This username is taken" });
        }
        const emailExist=await User.findOne({ email });
        if(emailExist){
            return res.status(400).json({ message: "This email has already a user" });
        }
        if(role==="admin"){
            const admin=await User.find({ role: "admin" });
            if(admin.length==1){
                return res.status(400).json({ message: "there is already an admin. cannot register another one" });
            }
        }
        const hashedPassword=await hashPassword(password);
        const user=new User({ name, username, email, phone, password: hashedPassword, role });
        await user.save();
        if(role==="seller"){
            const sellItems=new Sell({
                sellerId: user._id,
                itemIds: [],
                transactionIds: []
            });
            await sellItems.save();
        }
        else if(role==="customer"){
            const cart=new Cart({
                customerId: user._id,
                itemIds: []
            })
            await cart.save();
            const wishlist=new Wishlist({
                customerId: user._id,
                itemIds: []
            })
            await wishlist.save();
            const order=new Order({
                customerId: user._id,
                orders: []
            })
            await order.save();
        }
        else if(role==="deliveryAgent"){
            const deliveryOrders=new Delivery({ 
                deliveryAgentId: user._id,
                orders: []
            });
            await deliveryOrders.save();
        }
        const token=generateToken(user._id);
        res.cookie("auth", token, { httpOnly: true, secure: true, sameSite: "none" });
        return res.status(200).json( { user: user, message: "User registration successful" });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const loginUser=async(req, res)=>{
    try{
        const { credential, password, role }=req.body;
        if(!credential || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user=await User.findOne({ $or: [{ username: credential }, { email: credential }]});
        if(!user){
            return res.status(400).json({ message: "No user found" });
        }
        const isRoleMatches=await user.role===role;
        if(!isRoleMatches){
            if(role==="seller"){
                return res.status(400).json({ message: "You are not a seller" });
            }
            else if(role==="customer"){
                return res.status(400).json({ message: "You are not a customer" });
            }
            else if(role==="deliveryAgent"){
                return res.status(400).json({ message: "You are not in logistics" });
            }
            else{
                return res.status(400).json({ message: "You are not admin" });
            }
        }
        const isPasswordValid=await comparePassword(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({ message: "Incorrect password" });
        }
        const token=generateToken(user._id);
        res.cookie("auth", token, {httpOnly: true, secure: true, sameSite: "none"});
        return res.status(200).json({ user, token, message: "User login successful" });
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const logoutUser=async(req, res)=>{
    try{
        res.cookie("auth", "", { 
            httpOnly: true, 
            secure: true, 
            sameSite: "strict",
            expires: new Date(0)
        });
        return res.status(200).json({ message: "Logout successful" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const getProfile=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        if(!userId){
            return res.status(400).json({ message: "userId not found" });
        }
        const user=await User.findById(userId).select("name username email phone address");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const updateUser=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        const updateDetails=req.body;
        const updateUser=await User.findByIdAndUpdate(userId, updateDetails, { new: true });
        if(updateUser){
            return res.status(200).json({ message: "User details updated successfully" });
        }
        return res.status(400).json({ message: "User not found" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const deleteUser=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        res.cookie("auth", "", { 
            httpOnly: true, 
            secure: true, 
            sameSite: "strict",
            expires: new Date(0)
        });
        const user=await User.findByIdAndDelete(userId);
        if(user){
            return res.status(200).json({ message: "Account deleted successfully" });
        }
        return res.status(400).json({ message: "User not found" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const isAuth=(req, res)=>{
    if(req.cookies.auth){
        return res.status(200).json({ authenticated: true });
    }
    return res.status(200).json({ authenticated: false });
}

const isVerified=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ verified: user.verified });    
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports={
    registerUser, 
    loginUser, 
    logoutUser,
    getProfile,
    updateUser,
    deleteUser,
    isAuth,
    isVerified
}
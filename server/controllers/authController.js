
const { comparePassword, generateToken, hashPassword }=require("../config/authConfig");
const User=require("../models/authModel");
const Cart=require("../models/cartModel");
const Wishlist=require("../models/wishlistModel");
const Sell=require("../models/sellModel");

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
        const hashedPassword=await hashPassword(password);
        const user=new User({ name, username, email, phone, password: hashedPassword, role });
        await user.save();
        if(role==="seller"){
            const sellItems=new Sell({
                userId: user._id,
                itemIds: []
            });
            await sellItems.save();
        }
        else if(role==="customer"){
            const cart=new Cart({
                userId: user._id,
                itemIds: []
            })
            await cart.save();
            const wishlist=new Wishlist({
                userId: user._id,
                itemIds: []
            })
            await wishlist.save();
        }
        else{}
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
            else{
                return res.status(400).json({ message: "You are not a customer" });
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
        res.cookie("auth", "", { httpOnly: true, secure: true, sameSite: "strict" });
        return res.status(200).json({ message: "Logout successful" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

module.exports={
    registerUser, 
    loginUser, 
    logoutUser
}
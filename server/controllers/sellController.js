// @ts-nocheck
const User=require("../models/userModel");
const Sell=require("../models/sellModel");
const Item=require("../models/itemModel");
const { returnUserId }=require("../helpers/authHelper");
const Transaction = require("../models/transactionModel");


const createSellItem=async(req, res)=>{
    try{
        const sellerId=await returnUserId(req, res);
        const { name, type, description, price, pieceLeft }=req.body;
        if(!name || !type || !price || !pieceLeft){
            return res.status(400).json({ message: "All items are required" });
        }
        const seller=await User.findById(sellerId);
        if(!seller){
            return res.status(400).json({ message: "Seller not found" });
        }
        let images;
        if(Array.isArray(req.files)){
            images=req.files.map((file)=>({
                imageName: `${Date.now()}-${file.originalname}`,
                imageType: file.mimetype,
                image: file.buffer
            }));
        }
        const item=new Item({ sellerId, name, type, description, price, pieceLeft, images });
        await item.save();
        const selling=await Sell.findOne({ sellerId: sellerId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        selling.itemIds.push(item._id);
        await selling.save();
        return res.status(200).json({ item, message: "New item created" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const fetchSellItems=async(req, res)=>{
    try{
        const apiUrl=process.env.API_URL;
        const sellerId=await returnUserId(req, res);
        const seller=await User.findById(sellerId);
        if(!seller){
            return res.status(400).json({ message: "Seller not found" });
        }
        const selling=await Sell.findOne({ sellerId: sellerId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        const sellItems=await Promise.all(
            selling.itemIds.map(async(itemId)=>{
                const sellItem=await Item.findById(itemId);
                if(sellItem){
                    const imageUrls=sellItem.images.map((_, index)=>`${apiUrl}/fetchImage/${itemId}/${index}`);
                    return{
                        ...sellItem.toObject(),
                        imageUrls
                    }
                }
                return null;
            })
        )
        return res.json(sellItems);
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const fetchSellItem=async(req, res)=>{
    try{
        const apiUrl=process.env.API_URL;
        const sellerId=await returnUserId(req, res);
        const seller=await User.findById(sellerId);
        if(!seller){
            return res.status(400).json({ message: "Seller not found" });
        }
        const selling=await Sell.findOne({ sellerId: sellerId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        const { itemId }=req.params;
        const sellItemIndex=selling.itemIds.findIndex((itemId)=>itemId.toString()===itemId);
        if(sellItemIndex===-1){
            return res.status(400).json({ message: "Item not found" });
        }
        const item=await Item.findById(itemId);
        if(!item){
            return res.status(400).json({ message: "Item not found" });
        }
        const imageUrls=item.images.map((_, index)=>`${apiUrl}/fetchImage/${itemId}/${index}`);
        const sellItem={
            ...item.toObject(),
            imageUrls
        }
        return res.status(200).json(sellItem);
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const updateSellItem=async(req, res)=>{
    try{
        const sellerId=await returnUserId(req, res);
        const seller=await User.findById(sellerId);
        if(!seller){
            return res.status(400).json({ message: "Seller not found" });
        }
        const selling=await Sell.findOne({ sellerId: sellerId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        const { itemId }=req.params;
        const sellItemIndex=selling.itemIds.findIndex((itemId)=>itemId.toString()===itemId);
        if(sellItemIndex===-1){
            return res.status(400).json({ message: "Item not found"});
        }
        const updateData=req.body;
        const updateItem=await Item.findByIdAndUpdate(itemId, updateData, { new: true });
        if(!updateItem){
            return res.status(400).json({ message: "Error while updating" });
        }
        return res.status(200).json({ message: "Item updated successfully" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const deleteSellItem=async(req, res)=>{
    try{
        const sellerId=await returnUserId(req, res);
        const seller=await User.findById(sellerId);
        if(!seller){
            return res.status(400).json({ message: "Seller not found" });
        }
        const selling=await Sell.findOne({ sellerId: sellerId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        const { itemId }=req.params;
        const sellItemIndex=selling.itemIds.findIndex((itemId)=>itemId.toString()===itemId);
        if(sellItemIndex===-1){
            return res.status(400).json({ message: "Item not found" });
        }
        const deleteItem=await Item.findByIdAndDelete(itemId);
        if(!deleteItem){
            return res.status(400).json({ message: "Error while deleting" });
        }
        selling.itemIds.splice(sellItemIndex, 1);
        await selling.save();
        return res.status(200).json({ message: "Item deleted successfully" });
    }   
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const fetchTransactions=async(req, res)=>{
    try{
        const sellerId=await returnUserId(req, res);
        const transactions=await Transaction.find({ sellerId: sellerId});
        if(!transactions){
            return res.status(400).json({ message: "Seller transactions not found" });
        }
        const transactionDetails=await Promise.all(
            transactions.map(async (transaction)=>{
                const customer=await User.findById(transaction.customerId);
                const item=await Item.findById(transaction.itemId);
                return({
                    user: customer?.username,
                    item: item?.name,
                    date: transaction.date,
                    count: transaction.count,
                    status: transaction.status
                })
            })
        )
        return res.json(transactionDetails);
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports={
    createSellItem,
    fetchSellItems,
    fetchSellItem,
    updateSellItem,
    deleteSellItem,
    fetchTransactions
}
// @ts-nocheck
const User=require("../models/authModel");
const Sell=require("../models/sellModel");
const Item=require("../models/itemModel");
const { returnUserId }=require("../helpers/authHelper");


const createSellItem=async(req, res)=>{
    try{
        const userId=await returnUserId(req, res);
        const { name, type, description, price, pieceLeft }=req.body;
        if(!name || !type || !price || !pieceLeft){
            return res.status(400).json({ message: "All items are required" });
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        let images;
        if(Array.isArray(req.files)){
            images=req.files.map((file)=>({
                imageName: `${Date.now()}-${file.originalname}`,
                imageType: file.mimetype,
                image: file.buffer
            }));
        }
        const item=new Item({ name, type, description, price, pieceLeft, images });
        await item.save();
        const selling=await Sell.findOne({ userId: userId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        await selling.itemIds.push(item._id);
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
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const selling=await Sell.findOne({ userId: userId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        const sellItems=await Promise.all(
            selling.itemIds.map(async(id)=>{
                const sellItem=await Item.findById(id);
                if(sellItem){
                    const imageUrls=sellItem.images.map((_, index)=>`${apiUrl}/fetchImage/${id}/${index}`);
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
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const selling=await Sell.findOne({ userId: userId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        const { itemId }=req.params;
        const sellItemIndex=selling.itemIds.findIndex((id)=>id.toString()===itemId);
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
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const selling=await Sell.findOne({ userId: userId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        const { itemId }=req.params;
        const sellItemIndex=selling.itemIds.findIndex((id)=>id.toString()===itemId);
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
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const selling=await Sell.findOne({ userId: userId });
        if(!selling){
            return res.status(400).json({ message: "Not a seller" });
        }
        const { itemId }=req.params;
        const sellItemIndex=selling.itemIds.findIndex((id)=>id.toString()===itemId);
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

module.exports={
    createSellItem,
    fetchSellItems,
    fetchSellItem,
    updateSellItem,
    deleteSellItem
}
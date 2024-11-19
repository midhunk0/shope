// @ts-nocheck
const { returnUserId }=require("../helpers/authHelper");
const User=require("../models/authModel");
const Item=require("../models/itemModel");

const fetchImage=async(req, res)=>{
    try {
        const { id, imageIndex }=req.params;
        const index=parseInt(imageIndex);
        if(isNaN(index) || index<0){
            return res.status(400).json({ message: "Invalid image index." });
        }
        const item=await Item.findById(id);
        if(!item){
            return res.status(404).json({ message: "Item not found." });
        }
        const image=item.images?.[index];
        if(!image){
            return res.status(404).json({ message: "Image not found." });
        }
        res.set('Content-Type', image.imageType || 'application/octet-stream');
        return res.send(image.image);
    } 
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchItem=async(req, res)=>{
    try{
        const apiUrl=process.env.API_URL;
        const { itemId }=req.params;
        const item=await Item.findById(itemId);
        if(!item){
            return res.status(400).json({ message: "Item not found" });
        }
        const imageUrls=item.images.map((_, index)=>`${apiUrl}/fetchImage/${itemId}/${index}`);
        const rating=item.ratings.length>0 ? item.ratings.reduce((sum, rating)=>sum+rating.rating, 0)/item.ratings.length : 0;
        const { images, ratings, ...itemData }=item.toObject();
        const itemWithImages={
            ...itemData,
            rating,
            imageUrls
        }
        return res.status(200).json(itemWithImages);
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

const fetchItems=async(req, res)=>{
    try{
        const apiUrl=process.env.API_URL;
        const userId=await returnUserId(req, res);
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "No user found" });
        }
        const items=((await Item.find({ pieceLeft: { $gt: 0 }}).sort({ updatedAt: -1 })));
        const itemsWithImages=items.map((item)=>{
            const imageUrls=item.images.map((_, index)=>`${apiUrl}/fetchImage/${item._id}/${index}`);
            const rating=item.ratings.length>0 ? item.ratings.reduce((sum, rating)=>sum+rating.rating, 0)/item.ratings.length : 0;
            const { images, ratings, ...itemWithImages }=item.toObject();
            return{
                ...itemWithImages,
                imageUrls, 
                rating
            };
        });
        return res.status(200).json(itemsWithImages);
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}

module.exports={
    fetchImage,
    fetchItem,
    fetchItems
}
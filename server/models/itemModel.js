const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    }
}, { _id: false });

const ratingSchema=new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    customerId: {
        type: String,
        required: true
    }
}, { _id: false });

const itemsSchema=new mongoose.Schema({
    sellerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    pieceLeft: {
        type: Number,
        required: true,
        min: 0
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    images: [{
        imageName: String,
        imageType: String,
        image: Buffer,
    }],
    reviews: {
        type: [reviewSchema]
    },
    ratings: {
        type: [ratingSchema]
    }
}, { timestamps: true });

const Item=mongoose.model("Item", itemsSchema);
module.exports=Item;

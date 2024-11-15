const mongoose=require("mongoose");

const itemsSchema=new mongoose.Schema({
    userId: {
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
    images: [{
        imageName: String,
        imageType: String,
        image: Buffer,
    }]
}, { timestamps: true });

const Item=mongoose.model("Item", itemsSchema);

module.exports=Item;

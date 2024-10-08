const mongoose=require("mongoose");

const itemsSchema=new mongoose.Schema({
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
        required: true
    },
    pieceLeft: {
        type: Number,
        required: true
    },
    images: [{
        imageName: String,
        imageType: String,
        image: Buffer,
    }]
}, { timestamps: true });

const Item=mongoose.model("Item", itemsSchema);

module.exports=Item;

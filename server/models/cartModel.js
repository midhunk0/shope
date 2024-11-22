const mongoose=require("mongoose");

const itemSchema=new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
}, { _id: false });

const cartSchema=new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: {
        type: [itemSchema],
        required: true
    },
    cost: {
        type: Number,
        default: 0,
        min: 0
    }
}, { timestamps: true });

const Cart=mongoose.model("Cart", cartSchema);

module.exports=Cart;
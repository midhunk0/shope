const mongoose=require("mongoose");

const cartSchema=new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [{
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
    }],
    cost: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Cart=mongoose.model("Cart", cartSchema);

module.exports=Cart;

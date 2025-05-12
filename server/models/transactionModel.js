const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema({
    sellerId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    itemId: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "out for delivery", "delivered", "cancelled", "returned", "failed"],
        default: "pending"
    }
});

const Transaction=mongoose.model("transaction", transactionSchema);
module.exports=Transaction;
const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema({
    customerId: {
        type: String,
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
        enum: ["pending", "completed", "shipped", "cancelled"],
        default: "pending"
    }
}, { _id: false });

const sellSchema=new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    itemIds: {
        type: [String],
        required: true
    },
    transactions: {
        type: [transactionSchema],
        required: true
    }
}, { timestamps: true });

const Sell=mongoose.model("Sell", sellSchema);

module.exports=Sell;

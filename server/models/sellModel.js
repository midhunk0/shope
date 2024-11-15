const mongoose=require("mongoose");

const sellSchema=new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    itemIds: {
        type: [String],
        required: true
    },
    transactions: [{
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
        }
    }]
}, { timestamps: true });

const Sell=mongoose.model("Sell", sellSchema);

module.exports=Sell;

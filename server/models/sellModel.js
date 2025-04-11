const mongoose=require("mongoose");

const sellSchema=new mongoose.Schema({
    sellerId: {
        type: String,
        required: true
    },
    itemIds: {
        type: [String],
        required: true
    },
    transactionIds: {
        type: [String],
        required: true
    }
}, { timestamps: true });

const Sell=mongoose.model("Sell", sellSchema);
module.exports=Sell;

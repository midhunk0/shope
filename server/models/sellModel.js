const mongoose=require("mongoose");

const sellSchema=new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    itemIds: {
        type: [],
        required: true
    }
});

const Sell=mongoose.model("Sell", sellSchema);

module.exports=Sell;

const mongoose=require("mongoose");

const ordersSchema=new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { _id: false });

const deliverySchema=new mongoose.Schema({
    deliveryAgentId: {
        type: String,
        required: true
    },
    orders: {
        type: [ordersSchema],
        required: true
    }
}, { timestamps: true });

const Delivery=mongoose.model("Delivery", deliverySchema);
module.exports=Delivery;
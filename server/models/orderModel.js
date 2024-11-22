const mongoose=require("mongoose");

const shippingAddressSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, { _id: false });

const itemSchema=new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true,
        min: 1
    },
    reviewed: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const orderDetailsSchema=new mongoose.Schema({
    shippingAddress: {
        type: shippingAddressSchema,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    items: {
        type: [itemSchema],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "shipped", "cancelled"],
        default: "pending"
    }
})

const orderSchema=new mongoose.Schema({
    userId: {
        type: String, 
        required: true
    },
    orders: {
        type: [orderDetailsSchema],
        required: true
    }
}, { timestamps: true });

const Orders=mongoose.model("Orders", orderSchema);

module.exports=Orders;
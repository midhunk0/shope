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
    },
    transactionId: {
        type: String,
        required: true
    }
}, { _id: false });

const dateEventSchema=new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    event: {
        type: String,
        enum: ["order placed", "order confirmed", "order packed", "shipped", "out for delivery", "delivered", "cancelled", "return requested", "returned", "failed"],
        /*
        order placed - customer places the order
        order confirmed - seller/customer confirms ?
        order packed - order is packed and ready
        shipped - order shipped out
        out for delivery - on the way to customer
        delivered - order delivered
        cancelled - order cancelled
        return requested - customer initiates a return
        delivery failed - couldn't deliver to the customer
        */
        required: true
    }
}, { id: false });

const orderDetailsSchema=new mongoose.Schema({
    shippingAddress: {
        type: shippingAddressSchema,
        required: true,
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
        enum: ["pending", "confirmed", "shipped", "out for delivery", "delivered", "cancelled", "returned", "failed"],
        /*
        pending - order placed but not yet processed
        confirmed - order confirmed by seller/customer ? 
        shipped - order handed to courier
        out for delivery - out with delivery agent
        delivered - order delivered
        cancelled - cancelled before shipping
        returned - customer returned the item
        failed - delivery failed
        */ 
        default: "pending"
    },
    deliveryAgentId: {
        type: String,
        default: null
    },
    events: {
        type: [dateEventSchema],
        default: []
    }
}, { timestamps: true });

const orderSchema=new mongoose.Schema({
    customerId: {
        type: String, 
        required: true
    },
    orders: {
        type: [orderDetailsSchema],
        required: true
    }
});

const Order=mongoose.model("Order", orderSchema);
module.exports=Order;
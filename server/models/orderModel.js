const mongoose=require("mongoose");

const orderSchema=new mongoose.Schema({
    userId: {
        type: String, 
        required: true
    },
    orders: [{
        shippingAddress: {
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
        },
        date: {
            type: Date,
            default: Date.now,
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
                min: 1
            }
        }],
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "completed", "shipped", "cancelled"],
            default: "pending"
        }
    }]
}, { timestamps: true });

const Orders=mongoose.model("Orders", orderSchema)
module.exports=Orders;
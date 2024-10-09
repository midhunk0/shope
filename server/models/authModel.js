const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        default: "",
        unique: true
    },
    password: {
        type: String,
        requiref: true
    },
    address: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        required: true
    }
}, { timestamps: true });

const User=mongoose.model("User", UserSchema);

module.exports=User;
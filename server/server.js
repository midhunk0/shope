// @ts-nocheck
const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const multer=require("multer");
const cookieParser=require("cookie-parser");
const dotenv=require("dotenv").config();
const authRouter=require("./routes/authRoute");
const itemRouter=require("./routes/itemRoute");
const wishlistRouter=require("./routes/wishlistRoute");
const cartRouter=require("./routes/cartRoute");
const sellRouter=require("./routes/sellRoute");

const app=express();

app.use(
    cors({
        origin: process.env.FRONT_END_API,
        credentials: true,
    })
)

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res)=>{
    res.send("hello, server!");
})

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("mongoDB connected"))
    .catch((err)=>console.log(err));

const storage=multer.memoryStorage();
const upload=multer({ storage });

app.use("/", authRouter);
app.use("/", itemRouter);
app.use("/", wishlistRouter);
app.use("/", cartRouter);
app.use("/", sellRouter);

const port=process.env.PORT;
app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
});
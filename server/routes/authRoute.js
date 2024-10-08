const express=require("express");
const { loginUser, logoutUser, registerUser }=require("../controllers/authController");

const router=express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/logoutUser", logoutUser);

module.exports=router;
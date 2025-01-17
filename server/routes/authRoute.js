const express=require("express");
const { loginUser, logoutUser, registerUser, getProfile, deleteUser, updateUser, isAuth, isVerified }=require("../controllers/authController");

const router=express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/logoutUser", logoutUser);
router.get("/getProfile", getProfile);
router.delete("/deleteuser", deleteUser);
router.put("/updateUser", updateUser);
router.get("/isAuth", isAuth);
router.get("/isVerified", isVerified);

module.exports=router;
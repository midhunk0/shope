const { verifyToken }=require("../config/authConfig");

async function returnUserId(req, res){
    const token=req.cookies.auth;
    if(!token){
        return res.status(400).json({ message: "No token found" });
    }
    const decoded=verifyToken(token);
    const userId=decoded.userId;
    return userId;
}

module.exports={
    returnUserId
}
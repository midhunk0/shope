const { verifyToken }=require("../config/authConfig");

async function returnUserId(req, res){
    const token=req.cookies.auth;
    if(!token){
        return null;
    }
    try{
        const decoded=verifyToken(token);
        const userId=decoded.userId;
        return userId;
    }
    catch(err){
        return null;
    } 
}

module.exports={
    returnUserId
}
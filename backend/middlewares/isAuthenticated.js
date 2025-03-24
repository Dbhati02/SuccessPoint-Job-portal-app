const jwt = require("jsonwebtoken");
const User = require("../models/user-model")

const isAuthenticated = async (req,res,next) =>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message: "User not authenticated",
                success:false
            })
        }
        const decode = await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message: "Invalid token.",
                success:false
            })
        }
        req.id = decode.userId;
        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        req.user = user; 
        next();
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports = isAuthenticated;